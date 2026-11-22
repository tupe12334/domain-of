"""Narration script for The Journey Map of Bootstrapping.

Each segment: narration text, items to reveal as (item_id, cue_word),
optional camera ("cam": item ids to frame, or [x, y, width]),
optional "regions" to colour in, optional "scene" switch.
The cue word sets when an item pops in: its position in the sentence.
"""
import json
import os

S = []


def seg(text, show=(), cam=None, regions=(), scene=None, pause=0.35):
    S.append(dict(text=text, show=[list(x) for x in show], cam=cam,
                  regions=list(regions), scene=scene, pause=pause))


# ---------- INTRO (intro scene, screen space) ----------
seg("Imagine you've got an idea for a company, but no investors, and not much money.",
    [("i_founder", "Imagine"), ("i_nomoney", "investors")], scene="intro")
seg("That's how most companies start. Not with a big cheque, but in a spare room or a garage, paid for by the founders themselves.",
    [("i_garage", "garage")], scene="intro")
seg("It's called bootstrapping, from the old phrase about pulling yourself up by your own bootstraps.",
    [("i_boot", "bootstrapping")], scene="intro")
seg("And rather than a list of tips, I think it's best seen as a journey. So here's the map.",
    [("i_title", "map")], scene="intro", pause=0.8)

# ---------- MAP: START AND ORIGINS ----------
seg("Our journey starts down here, at the garage, with an idea.",
    [("start_garage", "garage")], cam=["start_garage"], scene="map")
seg("And plenty of famous companies set off from exactly this spot. H P started in a Palo Alto garage in 1939, with five hundred and thirty eight dollars. Spanx started with five thousand dollars of savings, and Atlassian with ten thousand dollars on a credit card.",
    [("o_hp", "H P"), ("o_spanx", "Spanx"), ("o_atlassian", "Atlassian")], cam=[1500, 3150, 2200])
seg("Mailchimp never took investment at all, and was sold in 2021 for around twelve billion dollars.",
    [("o_mailchimp", "Mailchimp")], cam=[1600, 3150, 2200])
seg("From here, the road winds through the whole adventure, all the way to a profitable company at the top right.",
    [("road_main", "road"), ("road_swamp", "road"), ("road_loop", "winds"),
     ("road_exit_a", "winds"), ("road_exit_b", "winds"), ("road_mountain", "adventure"),
     ("road_city", "top"), ("road_calm", "top")], cam=[3200, 1800, 6400])

# ---------- THE BACKPACK ----------
seg("But before we set off, let's check your backpack, because on this road the scarcest resources are your own.",
    [("pack_label", "backpack")], regions=["pack"], cam=[985, 690, 2000])
seg("Time, focus and energy.",
    [("p_time", "Time"), ("p_focus", "focus"), ("p_energy", "energy")], cam=[985, 690, 2000])
seg("The ability to say no, to most ideas and most features.",
    [("p_no", "say")], cam=[985, 690, 2000])
seg("A co-founder, if you have one, because that relationship matters as much as the product. And your health, because the company can't run without you.",
    [("p_cofounder", "co-founder"), ("p_health", "health")], cam=[985, 690, 2000])

# ---------- BASE CAMP: MONEY ----------
seg("Right, let's go. The first stop is base camp, where we sort out money.",
    [("camp_label", "base camp")], regions=["camp"], cam=[1050, 2050, 2200])
seg("Without investors, the number that rules your life is your runway: the cash you have, divided by what you spend each month.",
    [("c_runway", "runway")], cam=[900, 2050, 2000])
seg("So you keep the burn rate low. No office, free tools, and no big salaries.",
    [("c_burn", "burn")], cam=[900, 2050, 2000])
seg("Many founders keep their day job, and build in the evenings and at weekends.",
    [("c_dayjob", "day")], cam=[1300, 2050, 2000])
seg("Others sell their skills first. Consulting pays the bills, and teaches you what customers need. Basecamp started life as a web design agency.",
    [("c_services", "skills")], cam=[1400, 2050, 2000])
seg("Some get customers to fund them, with pre-orders or crowdfunding. And there are grants, which give you money without taking a piece of your company.",
    [("c_preorder", "pre-orders"), ("c_grants", "grants")], cam=[800, 2500, 2000])
seg("The trade off is simple. You keep full ownership, but you grow more slowly, and the risk is all yours.",
    [("c_own", "ownership"), ("c_slow", "slowly"), ("c_risk", "risk")], cam=[1000, 2600, 2000])

# ---------- THE FORK ----------
seg("Leaving camp, we soon reach a fork in the road.",
    [("fork_sign", "fork")], cam=[2200, 2300, 2000])
seg("Every fork is a reminder of opportunity cost. Whichever way you go, you give up the other.",
    [("s_oppcost", "opportunity")], cam=[2200, 2300, 2000])

# ---------- THE SWAMP ----------
seg("The easy road goes straight on: just build the thing. But it leads into the Swamp of No Market Need.",
    [("swamp_label", "Swamp")], regions=["swamp"], cam=[3200, 2900, 2400])
seg("In one famous survey of failed startups, this was the top reason they died. They built something nobody wanted.",
    [("sw_nobody", "survey")], cam=[3000, 2950, 2100])
seg("And the swamp is sticky, because of the sunk cost fallacy: the more you've already put in, the harder it is to turn back.",
    [("sw_sunk", "sunk")], cam=[3400, 3000, 2100])

# ---------- THE GRAVEYARD ----------
seg("Past the swamp is a place nobody wants to visit: the startup graveyard.",
    [("grave_label", "graveyard"), ("g_tomb1", "graveyard"), ("g_tomb2", "visit"), ("g_tomb4", "place")],
    regions=["graveyard"], cam=[5300, 3100, 2400])

# ---------- THE VILLAGE OF VALIDATION ----------
seg("So the smart road takes the long way round, through the Village of Validation.",
    [("village_label", "Village")], regions=["village"], cam=[2550, 1450, 2200])
seg("Here, Steve Blank's advice is to get out of the building and talk to people. He called it customer discovery.",
    [("v_discovery", "building")], cam=[2450, 1350, 2000])
seg("But people are polite, and they'll say your idea is great. The Mom Test says: don't ask about your idea, ask about their life. What did they do last time they had this problem?",
    [("v_momtest", "Mom")], cam=[2650, 1350, 2000])
seg("You can even test demand before building anything. A smoke test is a sign up page for a product that doesn't exist yet.",
    [("v_smoke", "smoke")], cam=[2450, 1650, 2000])
seg("A concierge test does the service by hand. And a Wizard of Oz test looks automatic, but has a human behind the curtain. Zappos began by photographing shoes in local shops.",
    [("v_concierge", "concierge"), ("v_wizard", "Wizard")], cam=[2700, 1700, 2000])
seg("What you're collecting here is evidence, not opinions.",
    [("v_evidence", "evidence")], cam=[2550, 1750, 2000])

# ---------- THE MVP ROUNDABOUT ----------
seg("Out of the village, the road reaches a roundabout. This is the M V P, the minimum viable product.",
    [("mvp_label", "roundabout")], regions=["mvp"], cam=[3800, 1350, 2200])
seg("Eric Ries described it as a loop: build, measure, learn. And the trick is to go round it as fast and as cheaply as you can.",
    [("r_build", "build"), ("r_measure", "measure,"), ("r_learn", "learn.")], cam=[3800, 1350, 2200])
seg("To build, cut ruthlessly. Henrik Kniberg's famous drawing says: if you want a car, don't start with a wheel. Start with a skateboard, because it's already useful.",
    [("r_skate", "skateboard")], cam=[3700, 1100, 2000])
seg("Use no code tools, and do things that don't scale, like Airbnb's founders photographing apartments themselves.",
    [("r_nocode", "code"), ("r_dontscale", "scale")], cam=[3900, 1100, 2000])
seg("To measure, skip the vanity metrics and watch retention. Do people come back without being pushed?",
    [("r_vanity", "vanity"), ("r_retention", "retention")], cam=[3600, 1600, 2000])
seg("Dropbox measured interest before its product was ready. A simple demo video took the waiting list from five thousand to seventy five thousand people overnight.",
    [("r_dropbox", "Dropbox")], cam=[3600, 1850, 2000])
seg("And to learn, you decide which exit to take. Some of the best companies came off this roundabout somewhere unexpected.",
    [], cam=[3800, 1350, 2400])
seg("Slack took the exit marked failed video game. Instagram took the one marked Burbn, a check in app, and kept only the photos.",
    [("x_slack", "Slack"), ("x_insta", "Instagram")], cam=[3850, 1350, 2600])

# ---------- MILESTONES ----------
seg("Leaving the roundabout, you pass a milestone worth celebrating: ramen profitable. That's Paul Graham's name for earning just enough to cover the founders' living costs.",
    [("m_ramen", "ramen")], cam=[4400, 1500, 2000])
seg("From here the company is default alive. If nothing changes, it survives, and you can take your time.",
    [("m_alive", "default")], cam=[4400, 1500, 2000])

# ---------- THE MOUNTAIN: PROJECT MANAGEMENT ----------
seg("Then comes the climb: the mountain of getting things done. Project management.",
    [("mountain_label", "mountain")], regions=["mountain", "snow"], cam=[5200, 1450, 3400])
seg("Some people try to go straight up the waterfall: plan everything, then design, then build, then test. Even Winston Royce's 1970 paper, which is credited with it, warned that it was risky.",
    [("pm_waterfall", "waterfall")], cam=[5600, 1650, 2000])
seg("Most small teams take the switchbacks instead: short steps that each get you a bit higher. That's the spirit of the Agile Manifesto, written at a ski resort in Utah in two thousand and one.",
    [("pm_agile", "Agile")], cam=[4900, 1700, 2000])
seg("Scrum climbs in sprints, with a daily stand up and a retrospective after each one. Kanban limits how much you carry at once.",
    [("pm_scrum", "Scrum"), ("pm_kanban", "Kanban")], cam=[5200, 1300, 2000])
seg("Basecamp's Shape Up fixes the time, usually six weeks, and cuts the scope to fit.",
    [("pm_shapeup", "Shape")], cam=[5500, 1000, 2000])
seg("To choose what to carry up, a RICE score rates each idea by reach, impact, confidence and effort. And O K Rs plant flags higher up the mountain to aim for.",
    [("pm_rice", "RICE"), ("pm_okr", "O K Rs")], cam=[5000, 850, 2000])
seg("Watch out for the warning signs. Parkinson's law: work expands to fill the time available. And Brooks's law: adding people to a late project makes it later.",
    [("w_parkinson", "Parkinson's"), ("w_brooks", "Brooks's")], cam=[5200, 1150, 2200])
seg("And the Pareto principle: roughly eighty percent of the results come from twenty percent of the work. On a steep climb, that's the twenty percent you want.",
    [("w_pareto", "Pareto")], cam=[5200, 1150, 2200])

# ---------- THE FOG ----------
seg("Down on the lower slopes, the road disappears into fog: the Fog of Luck and Timing.",
    [("fog_label", "Fog")], regions=["fog"], cam=[5150, 2000, 2200])
seg("Bill Gross studied around two hundred companies, and found that timing explained more of their success than the idea, the team or the money.",
    [("fg_gross", "Gross")], cam=[5000, 2050, 2000])
seg("Webvan's grocery deliveries came too early, and ended up in the graveyard in 2001. Instacart made the same idea work a decade later.",
    [("fg_early", "Webvan"), ("g_tomb3", "graveyard")], cam=[5450, 2600, 2600])
seg("You can't control luck. But a long runway lets you stay on the road long enough to meet it.",
    [("fg_survive", "luck")], cam=[5150, 2050, 2200])

# ---------- THE SUMMIT: DESTINATIONS ----------
seg("And at the top, the road splits one last time. This fork is about why you're doing all this.",
    [("summit", "top")], cam=[5800, 750, 2200])
seg("One road leads to Unicorn City: grow as fast as possible, whatever it takes.",
    [("dest_unicorn", "Unicorn")], regions=["city"], cam=[5900, 600, 2000])
seg("The other leads to what Jason Fried and David Heinemeier Hansson call a calm company: profitable, sustainable, and with time for a life.",
    [("dest_calm", "calm")], regions=["calm"], cam=[5900, 900, 2000])
seg("There's no right answer. But a bootstrapper gets to choose.",
    [], cam=[5900, 800, 2400])

# ---------- OUTRO ----------
seg("So that's the road. Looking back over the whole map, what I like about it is that it's really a map of constraints.",
    [("sig", "map")], cam=[3200, 1800, 6400])
seg("No money and no time sound like weaknesses, but they force you to find out what matters, fast.",
    [], cam=[3200, 1800, 6400])
seg("Find a real problem, build the smallest thing that helps, learn from it, keep your costs low, and keep walking.",
    [], cam=[3200, 1800, 6400])
seg("Thanks for watching.", [], cam=[3200, 1800, 6400], pause=3.0)

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "narration_script.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(S, f, indent=1)
    words = sum(len(s["text"].split()) for s in S)
    print(len(S), "segments,", words, "words")
