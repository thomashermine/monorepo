import { useState } from "react";
import type { Comment } from "~/lib/db.server";

interface CommentPinProps {
    comment: Comment;
    index: number;
}

export function CommentPin({ comment, index }: CommentPinProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${comment.x}%`, top: `${comment.y}%` }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
            }}
        >
            <div className="w-7 h-7 rounded-full bg-corten text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-lg ring-2 ring-white hover:scale-110 transition-transform">
                {index + 1}
            </div>
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-concrete shadow-xl p-3 pointer-events-auto">
                    <p className="text-sm font-bold text-ink">{comment.author}</p>
                    <p className="text-sm text-steel mt-1">{comment.text}</p>
                    <p className="text-xs text-steel/60 mt-2">
                        {new Date(comment.created_at + "Z").toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
            )}
        </div>
    );
}
