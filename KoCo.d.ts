export interface KonamiCodeOptions
{
	requireEnterPress? : boolean;
	allowedTimeBetweenKeys? : number;
}

// --------------------------------------------------------

export interface KonamiCodeSupportRemover
{
	() : void
}

// --------------------------------------------------------

export function addSupportForTheKonamiCode(options? : KonamiCodeOptions) : KonamiCodeSupportRemover;
