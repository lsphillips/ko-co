export interface KonamiCodeOptions
{
	requireEnterPress? : boolean;
	allowedTimeBetweenKeys? : number;
}

// --------------------------------------------------------

export interface RemoveSupportForTheKonamiCode
{
	() : void
}

// --------------------------------------------------------

export function addSupportForTheKonamiCode(options? : KonamiCodeOptions) : RemoveSupportForTheKonamiCode;
