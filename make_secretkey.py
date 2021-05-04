#!/bin/bash

import random
import sys

chars = 'qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM<>^1234567890#()[]*%&=-_'

length = 32
num = 1


if "-hex" in sys.argv:
  chars = '1234567890abcdef'
  sys.argv.remove("-hex")

if len(sys.argv) > 1:
  length = int(sys.argv[1])

if len(sys.argv) > 2:
  num = int(sys.argv[2])

keys = []

for i in range (num):
  key = ''.join([random.SystemRandom().choice(chars) for i in range(length)])
  print(f"Key {i+1}: {key}")
