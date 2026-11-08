"use client";

import {
  CheckCircleIcon,
  FileArrowUpIcon,
  FileIcon,
  ImageSquareIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const MAGNET_DISTANCE = 180;
const MAX_MAGNET_OFFSET = 10;
const MAGNET_SPRING = { damping: 24, mass: 0.65, stiffness: 280 };

type MagneticDropZoneProps = {
  accept?: string;
  className?: string;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function acceptsFile(file: File, accept: string) {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return accept.split(",").map((rule) => rule.trim().toLowerCase()).some((rule) => {
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1));
    return fileType === rule;
  });
}

function isFileDrag(dataTransfer: DataTransfer | null) {
  return dataTransfer ? Array.from(dataTransfer.types).includes("Files") : false;
}

export function MagneticDropZone({
  accept = "image/*",
  className = "",
  maxSize = 20 * 1024 * 1024,
  onFilesChange,
}: MagneticDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isNear, setIsNear] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const magnetScale = useMotionValue(1);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(magnetX, MAGNET_SPRING);
  const springY = useSpring(magnetY, MAGNET_SPRING);
  const springScale = useSpring(magnetScale, MAGNET_SPRING);
  const springGlowX = useSpring(glowX, MAGNET_SPRING);
  const springGlowY = useSpring(glowY, MAGNET_SPRING);
  const transform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0) scale(${springScale})`;
  const glowTransform = useMotionTemplate`translate3d(${springGlowX}px, ${springGlowY}px, 0)`;

  const resetMagnet = useCallback(() => {
    magnetX.set(0);
    magnetY.set(0);
    magnetScale.set(1);
    glowX.set(0);
    glowY.set(0);
    setIsNear(false);
    setIsOver(false);
  }, [glowX, glowY, magnetScale, magnetX, magnetY]);

  useEffect(() => {
    function handleWindowDragOver(event: globalThis.DragEvent) {
      if (!isFileDrag(event.dataTransfer) || !zoneRef.current) return;
      const rect = zoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceFromEdgeX = Math.max(Math.abs(event.clientX - centerX) - rect.width / 2, 0);
      const distanceFromEdgeY = Math.max(Math.abs(event.clientY - centerY) - rect.height / 2, 0);
      const distance = Math.hypot(distanceFromEdgeX, distanceFromEdgeY);
      const pointerIsOver = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      const proximity = Math.max(0, 1 - distance / MAGNET_DISTANCE);
      if (proximity === 0) {
        resetMagnet();
        return;
      }
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const pointerDistance = Math.max(Math.hypot(deltaX, deltaY), 1);
      const offset = pointerIsOver ? 0 : proximity * MAX_MAGNET_OFFSET;
      magnetX.set(shouldReduceMotion ? 0 : (deltaX / pointerDistance) * offset);
      magnetY.set(shouldReduceMotion ? 0 : (deltaY / pointerDistance) * offset);
      magnetScale.set(shouldReduceMotion ? 1 : pointerIsOver ? 1.025 : 1.01);
      glowX.set(shouldReduceMotion ? 0 : deltaX);
      glowY.set(shouldReduceMotion ? 0 : deltaY);
      setIsNear(true);
      setIsOver(pointerIsOver);
    }

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("dragend", resetMagnet);
    window.addEventListener("drop", resetMagnet);
    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("dragend", resetMagnet);
      window.removeEventListener("drop", resetMagnet);
    };
  }, [glowX, glowY, magnetScale, magnetX, magnetY, resetMagnet, shouldReduceMotion]);

  const acceptFiles = useCallback((incomingFiles: File[]) => {
    const nextFiles = incomingFiles.slice(0, 1);
    const unsupportedFile = nextFiles.find((file) => !acceptsFile(file, accept));
    const oversizedFile = nextFiles.find((file) => file.size > maxSize);
    if (unsupportedFile) {
      setFiles([]);
      setError(`${unsupportedFile.name} is not a supported image.`);
      onFilesChange?.([]);
      return;
    }
    if (oversizedFile) {
      setFiles([]);
      setError(`${oversizedFile.name} is larger than ${formatBytes(maxSize)}.`);
      onFilesChange?.([]);
      return;
    }
    if (!nextFiles.length) return;
    setFiles(nextFiles);
    setError(null);
    onFilesChange?.(nextFiles);
  }, [accept, maxSize, onFilesChange]);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    acceptFiles(Array.from(event.dataTransfer.files));
    resetMagnet();
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!isFileDrag(event.dataTransfer)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function clearFiles() {
    setFiles([]);
    setError(null);
    onFilesChange?.([]);
  }

  const firstFile = files[0];
  const title = isOver ? "Пусни снимката тук" : isNear ? "Доближи снимката" : "Пусни снимка тук";

  return (
    <motion.div
      className={`upload-zone ${isOver ? "is-over" : ""} ${isNear ? "is-near" : ""} ${className}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={zoneRef}
      style={{ transform: shouldReduceMotion ? undefined : transform }}
    >
      <input accept={accept} className="upload-input" onChange={handleInputChange} ref={inputRef} type="file" />
      <motion.div aria-hidden="true" className={`upload-glow ${isNear ? "visible" : ""}`} style={{ transform: glowTransform }} />
      {firstFile ? (
        <div className="upload-selected">
          <div className="upload-file-icon"><ImageSquareIcon size={24} weight="fill" /></div>
          <div className="upload-ready"><CheckCircleIcon size={16} weight="fill" /> Снимката е готова</div>
          <p>{firstFile.name}</p>
          <small>{formatBytes(firstFile.size)}</small>
          <div className="upload-actions">
            <button type="button" onClick={() => inputRef.current?.click()}><UploadSimpleIcon size={15} weight="bold" /> Смени</button>
            <button type="button" onClick={clearFiles}><XIcon size={15} weight="bold" /> Премахни</button>
          </div>
        </div>
      ) : (
        <button className="upload-trigger" onClick={() => inputRef.current?.click()} type="button">
          <div className="upload-file-icon"><FileArrowUpIcon size={24} weight="fill" /></div>
          <strong>{title}</strong>
          <span>или натисни за избор · до {formatBytes(maxSize)}</span>
        </button>
      )}
      {error ? <p className="upload-error" aria-live="polite">{error}</p> : <FileIcon className="upload-background-icon" size={24} />}
    </motion.div>
  );
}
