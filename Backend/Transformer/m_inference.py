#! python

import os
import argparse
import json
import sys
sys.path.append(os.getcwd())
from model import amt

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', help='input file path')
    parser.add_argument('-o', help='output file path')
    args = parser.parse_args()

    # config file
    with open("./Transformer/config.json", 'r', encoding='utf-8') as f:
        config = json.load(f)

    # AMT class
    AMT = amt.AMT(config, './Transformer/checkpoint/model_016_003.pkl', verbose_flag = False)

    # feature
    a_feature = AMT.wav2feature(args.i)

    # transcript
    _, _, _, _, output_2nd_onset, output_2nd_offset, output_2nd_mpe, output_2nd_velocity = AMT.transcript(a_feature)

    # note (mpe2note)
    a_note_2nd_predict = AMT.mpe2note(a_onset=output_2nd_onset,
                                        a_offset=output_2nd_offset,
                                        a_mpe=output_2nd_mpe,
                                        a_velocity=output_2nd_velocity,
                                        thred_onset=0.5,
                                        thred_offset=0.5,
                                        thred_mpe=0.5,
                                        mode_velocity='ignore_zero',
                                        mode_offset='shorter')
    
    AMT.note2midi(a_note_2nd_predict, args.o)

print('** done **')
