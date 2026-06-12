export type VideoSource = {
	type: 'youtube' | 'vimeo' | 'local';
	embedUrl?: string;
	src?: string;
};

export function parseVideoSource(url: string): VideoSource {
	if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
		const src = url.startsWith('/') ? url : url.replace(/^\.\//, '/');
		return { type: 'local', src };
	}

	try {
		const parsed = new URL(url);

		if (parsed.hostname.includes('youtu.be')) {
			const id = parsed.pathname.slice(1);
			return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
		}

		if (parsed.hostname.includes('youtube.com')) {
			const id = parsed.searchParams.get('v');
			if (id) {
				return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
			}
		}

		if (parsed.hostname.includes('vimeo.com')) {
			const id = parsed.pathname.split('/').filter(Boolean).pop();
			if (id) {
				return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` };
			}
		}
	} catch {
		// Fall through to unknown handling below.
	}

	return { type: 'local', src: url };
}
