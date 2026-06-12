import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categoriaProyecto = z.enum([
	'Cortometraje',
	'Video Musical',
	'Comercial',
	'Documental',
	'Corporativo',
	'Evento',
	'Otro',
]);

/** Acepta URLs de Vimeo/YouTube o rutas locales (ej. /videos/reel.mp4) */
const videoPrincipal = z.string().refine(
	(value) => {
		if (value.startsWith('/') || value.startsWith('./') || value.startsWith('../')) {
			return true;
		}

		try {
			const url = new URL(value);
			return url.protocol === 'http:' || url.protocol === 'https:';
		} catch {
			return false;
		}
	},
	{
		message:
			'videoPrincipal debe ser una URL de Vimeo/YouTube o una ruta local (ej. /videos/reel.mp4)',
	},
);

const proyectos = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/proyectos' }),
	schema: ({ image }) =>
		z.object({
			titulo: z.string(),
			descripcion: z.string(),
			categoria: categoriaProyecto,
			videoPrincipal,
			imagenesBTS: z.array(image()).default([]),
			fecha: z.coerce.date(),
		}),
});

export const collections = { proyectos };
