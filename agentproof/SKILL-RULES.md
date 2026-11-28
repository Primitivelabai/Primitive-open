# Skill description rule

The description is how an agent decides whether to load a skill. If it reads vaguely, the skill never gets used, however good it is.

Every `description:` must:

1. **Open with what the skill does, in plain words.** Start with a verb ("Checks…", "Writes…", "Tries to break…"), not "Use when", jargon or a category name.
2. **Name the concrete triggers.** Give the actual words and situations that should load it: "done", "CI green", "deployed", "try to break it", "a panel of experts".
3. **Say what it is not for,** when a nearby skill or ordinary task could be mistaken for it.
4. **Stay under 80 words,** in one paragraph.

Before merging a description change, rerun the trigger cases in the A/B bench. If the skill stops being picked up, revert the wording.
