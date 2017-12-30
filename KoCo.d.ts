export interface KonamiCodeOptions
{
	requireEnterPress? : boolean;
	allowedTimeBetweenKeys? : number;
}

// --------------------------------------------------------

export function addSupportForTheKonamiCode(options? : KonamiCodeOptions) : void;
