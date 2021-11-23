import {Ci, CiReco} from "types/types";

export const ciReco = (ciClose: Ci[], ciOpening: Ci[], ciDistant: Ci[]): 
        CiReco =>
    Object.freeze({
        ciClose: ciClose, 
        ciOpening: ciOpening, 
        ciDistant: ciDistant
    });


