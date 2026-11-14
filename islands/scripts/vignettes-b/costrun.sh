#!/bin/bash
# costrun.sh <label>: per-card 1440 light, 390 dark, whole #features section; loadavg beside every run
L=/home/luka/projects/kuberik/.work/landing-v6/ship/cost
cd /home/luka/projects/kuberik/.work/landing-v6/wt-ship/islands
echo "# $1  start loadavg: $(cat /proc/loadavg)"
for args in "bento 1440 4 8 light" "bento 390 4 8 dark" "section 1440 4 8 light"; do
  echo "## cost.mjs $args"; URL=http://127.0.0.1:1376/ node scripts/vignettes-b/cost.mjs $args; echo "  loadavg after: $(cat /proc/loadavg)"
done
