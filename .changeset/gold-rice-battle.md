---
'@haishin/frontend': patch
---

Fixes issues caused by nextjs apparently including the whole utils when we just want specific functions (ie. stop trying to use child_process when you can't)
