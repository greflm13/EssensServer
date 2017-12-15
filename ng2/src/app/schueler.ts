export interface Schuelers {
    schueler: Schueler[];
}

export interface Schueler {
    name: string;
    klasse: string;
    mo: boolean;
    di: boolean;
    mi: boolean;
    do: boolean;
    fr: boolean;
}

export interface Essen {
    montag: string;
    dienstag: string;
    mittwoch: string;
    donnerstag: string;
    freitag: string;
}