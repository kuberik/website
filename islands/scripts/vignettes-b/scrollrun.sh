#!/bin/bash
cd /home/luka/projects/kuberik/.work/landing-v6/wt-ship/islands
echo "# SCROLL PASS (whole page, top to bottom, 4x CPU)  1377 = BEFORE (8d7a9e53), 1376 = AFTER"
for u in http://127.0.0.1:1377/ http://127.0.0.1:1376/; do for a in "1440 light" "390 dark"; do URL=$u node scripts/vignettes-b/scrollpass.mjs $a; done; done
