export interface ImageEntry {
    id: string;
    src: string;
    title: string;
    description: string;
}

export const images: ImageEntry[] = [
    {
        id: "cuisine-v4",
        src: "/images/b14-cuisine-v4.png",
        title: "Cuisine — Projection v1",
        description: "Première projection de la cuisine avec îlot central",
    },
    {
        id: "cuisine-v5",
        src: "/images/b14-cuisine-v5.png",
        title: "Cuisine — Projection v2",
        description: "Itération sur la cuisine, variante matériaux",
    },
    {
        id: "sdb-beige",
        src: "/images/b14-sdb-beige.png",
        title: "Salle de bain — Option beige",
        description: "Salle de bain principale, tons beige et chêne",
    },
    {
        id: "sdb-tasseaux",
        src: "/images/b14-sdb-tasseaux.png",
        title: "Salle de bain — Tasseaux chêne",
        description: "Variante avec tasseaux de chêne",
    },
    {
        id: "plan",
        src: "/images/b14-plan.png",
        title: "Plan — Proposition d'aménagement",
        description: "Plan d'aménagement général du loft",
    },
];
