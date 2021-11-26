import {Ci} from "utils/helpers/Ci";


export type CiReco = {
    ciClose: Ci[];
    ciOpening: Ci[];
    ciDistant: Ci[];
};


export const ciReco = (ciClose: Ci[], ciOpening: Ci[], ciDistant: Ci[]): 
        CiReco =>
    Object.freeze({
        ciClose: ciClose, 
        ciOpening: ciOpening, 
        ciDistant: ciDistant
    });


