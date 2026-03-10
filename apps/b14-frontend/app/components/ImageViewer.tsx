import { useState, useEffect, useCallback } from "react";
import type { Comment } from "~/lib/db.server";
import type { ImageEntry } from "~/lib/images";
import { CommentPin } from "./CommentPin";
import { CommentForm } from "./CommentForm";

interface ImageViewerProps {
    image: ImageEntry;
    onClose: () => void;
}

export function ImageViewer({ image, onClose }: ImageViewerProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        const res = await fetch(`/api/comments/${image.id}`);
        const data = await res.json();
        setComments(data);
        setLoading(false);
    }, [image.id]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (pendingPin) setPendingPin(null);
                else onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose, pendingPin]);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPendingPin({ x, y });
    };

    const handleSubmitComment = async (data: { author: string; text: string }) => {
        if (!pendingPin) return;
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                imageId: image.id,
                x: pendingPin.x,
                y: pendingPin.y,
                ...data,
            }),
        });
        if (res.ok) {
            setPendingPin(null);
            fetchComments();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-ink/90 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-ink/80 backdrop-blur-sm">
                <div>
                    <h3 className="text-white font-bold">{image.title}</h3>
                    <p className="text-steel-light text-sm mt-0.5">
                        Cliquez sur l'image pour commenter • {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-steel-light hover:text-white transition-colors text-2xl leading-none px-2"
                >
                    ✕
                </button>
            </div>

            {/* Image + comments area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main image */}
                <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                    <div className="relative inline-block max-w-full max-h-full">
                        <div className="relative cursor-crosshair" onClick={handleImageClick}>
                            <img
                                src={image.src}
                                alt={image.title}
                                className="max-w-full max-h-[calc(100vh-12rem)] object-contain select-none"
                                draggable={false}
                            />
                            {/* Existing comment pins */}
                            {comments.map((comment, i) => (
                                <CommentPin key={comment.id} comment={comment} index={i} />
                            ))}
                            {/* Pending pin */}
                            {pendingPin && (
                                <>
                                    <div
                                        className="absolute z-25 -translate-x-1/2 -translate-y-1/2"
                                        style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%` }}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-zellige text-white text-xs font-bold flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
                                            +
                                        </div>
                                    </div>
                                    <CommentForm
                                        x={pendingPin.x}
                                        y={pendingPin.y}
                                        imageId={image.id}
                                        onSubmit={handleSubmitComment}
                                        onCancel={() => setPendingPin(null)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments sidebar */}
                <div className="w-80 bg-white border-l border-concrete overflow-y-auto hidden lg:block">
                    <div className="p-4 border-b border-concrete">
                        <h4 className="text-sm uppercase tracking-[0.15em] text-corten font-bold">
                            Commentaires
                        </h4>
                    </div>
                    {loading ? (
                        <p className="p-4 text-sm text-steel">Chargement...</p>
                    ) : comments.length === 0 ? (
                        <p className="p-4 text-sm text-steel">
                            Aucun commentaire. Cliquez sur l'image pour en ajouter un.
                        </p>
                    ) : (
                        <div className="divide-y divide-concrete">
                            {comments.map((comment, i) => (
                                <div key={comment.id} className="p-4 hover:bg-concrete/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-5 h-5 rounded-full bg-corten text-white text-[10px] font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-bold text-ink">
                                            {comment.author}
                                        </span>
                                    </div>
                                    <p className="text-sm text-steel ml-7">{comment.text}</p>
                                    <p className="text-xs text-steel/50 ml-7 mt-1">
                                        {new Date(comment.created_at + "Z").toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
