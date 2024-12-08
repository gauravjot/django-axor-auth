export const versions = [
    {
        name: 'v0.2',
        homepage: 'installation' // directly within the version folder
    },
];

// Do not change below this line

import {defineCollection, z} from 'astro:content';

const docsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        next: z.string().nullable().optional(),
        prev: z.string().nullable().optional(),
        sort: z.number().nullable().optional(),
        alias: z.string().nullable().optional(),
    })
});

export const collections = Object.fromEntries(versions.map(version => [version.name, docsCollection]));