import { getMeasureDivisions, getMeasureNumber, getStaffInfo } from "../src/midiToMusicXML/staff_model";
import { ANNA_MAGDALENA_BACH, DOUBLE_SCALE, DOUBLE_SCALE_TIME_SIG_CHANGE } from "../src/SampleNoteSequences";
import { DEFAULT_TIME_SIGNATURE } from "../src/midiToMusicXML/staff_info";

test("Testing 4/4 at measure 1", () => {
    expect(getMeasureDivisions(0, [DEFAULT_TIME_SIGNATURE])).toStrictEqual({ start: 0, end: 1024 });
});

test("Testing 4/4 at measure 2", () => {
    expect(getMeasureDivisions(1024, [DEFAULT_TIME_SIGNATURE])).toStrictEqual({ start: 1024, end: 2048 });
});

test("Testing 3/4 at measure 1", () => {
    expect(getMeasureDivisions(0, getStaffInfo(ANNA_MAGDALENA_BACH).timeSignatures)).toStrictEqual({
        start: 0,
        end: 768,
    });
});

test("Testing 3/4 at measure 2", () => {
    expect(getMeasureDivisions(768, getStaffInfo(ANNA_MAGDALENA_BACH).timeSignatures)).toStrictEqual({
        start: 768,
        end: 1536,
    });
});

// test("Testing 2/4 at measure 1", () => {
//     expect(getMeasureDivisions(0, getStaffInfo(DOUBLE_SCALE).timeSignatures)).toBe(1);
// });

// test("Testing 2/4 at measure 2", () => {
//     expect(getMeasureDivisions(512, getStaffInfo(DOUBLE_SCALE).timeSignatures)).toBe(2);
// });

// test("Testing 2/4 at measure 3", () => {
//     expect(getMeasureDivisions(1024, getStaffInfo(DOUBLE_SCALE).timeSignatures)).toBe(3);
// });

// test("Testing 2/4 to 4/4 time sig change at measure 1", () => {
//     expect(getMeasureDivisions(0, getStaffInfo(DOUBLE_SCALE_TIME_SIG_CHANGE).timeSignatures)).toBe(1);
// });

// test("Testing 2/4 to 4/4 time sig change at measure 4", () => {
//     expect(getMeasureDivisions(2048, getStaffInfo(DOUBLE_SCALE_TIME_SIG_CHANGE).timeSignatures)).toBe(4);
// });
