export function formatFecha(fecha: Date): string {
	return fecha.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
	});
}
