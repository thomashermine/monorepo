import { useState, useEffect } from "react";

interface CommentFormProps {
    x: number;
    y: number;
    imageId: string;
    onSubmit: (comment: { author: string; text: string }) => void;
    onCancel: () => void;
}

export function CommentForm({ x, y, imageId, onSubmit, onCancel }: CommentFormProps) {
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");
    const [showAuthorField, setShowAuthorField] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("b14-author");
        if (saved) {
            setAuthor(saved);
            setShowAuthorField(false);
        } else {
            setShowAuthorField(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !text.trim()) return;
        localStorage.setItem("b14-author", author.trim());
        onSubmit({ author: author.trim(), text: text.trim() });
    };

    return (
        <div
            className="absolute z-30 w-72 bg-white border border-concrete shadow-2xl p-4"
            style={{
                left: `${Math.min(x, 70)}%`,
                top: `${Math.min(y, 70)}%`,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {showAuthorField && (
                    <input
                        type="text"
                        placeholder="Votre nom"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border border-concrete px-3 py-2 text-sm focus:outline-none focus:border-corten"
                        autoFocus
                    />
                )}
                {!showAuthorField && (
                    <p className="text-xs text-steel">
                        Commentaire en tant que{" "}
                        <button
                            type="button"
                            className="text-corten underline"
                            onClick={() => setShowAuthorField(true)}
                        >
                            {author}
                        </button>
                    </p>
                )}
                <textarea
                    placeholder="Votre commentaire..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    className="border border-concrete px-3 py-2 text-sm resize-none focus:outline-none focus:border-corten"
                    autoFocus={!showAuthorField}
                />
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 text-xs text-steel hover:text-ink transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-1.5 text-xs bg-corten text-white hover:bg-corten-dark transition-colors"
                    >
                        Poster
                    </button>
                </div>
            </form>
        </div>
    );
}
