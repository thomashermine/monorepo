import { useState } from "react";
import { images } from "~/lib/images";
import { ImageViewer } from "./ImageViewer";

export function Gallery() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = images.find((img) => img.id === selectedId);

    return (
        <section id="galerie" className="py-24 md:py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-sm uppercase tracking-[0.2em] text-corten mb-4 text-center">
                    Galerie & Feedback
                </h2>
                <p className="text-center text-steel mb-16 max-w-xl mx-auto">
                    Cliquez sur une image pour la visualiser et laisser vos commentaires
                    directement aux endroits qui vous interpellent.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedId(image.id)}
                            className="group text-left border border-concrete hover:border-corten/40 transition-all overflow-hidden bg-white"
                        >
                            <div className="aspect-video overflow-hidden bg-concrete/20">
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-ink text-sm">
                                    {image.title}
                                </h3>
                                <p className="text-xs text-steel mt-1">
                                    {image.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selected && (
                <ImageViewer
                    image={selected}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </section>
    );
}
