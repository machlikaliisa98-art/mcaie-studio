"use client";

import { RefObject } from "react";

export interface Camera {
    id: string;
    name: string;
    stream?: MediaStream | null;
    muted?: boolean;
    role?: string;
    onStage?: boolean;
    handRaised?: boolean;
}

interface CameraGridProps {
    cameras: Camera[];
    videoRefs: Record<string, RefObject<HTMLVideoElement | null>>;
}

export default function CameraGrid({
    cameras,
    videoRefs,
}: CameraGridProps) {