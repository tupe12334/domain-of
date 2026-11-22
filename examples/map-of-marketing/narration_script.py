"""Narration script for The Map of Marketing.

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


# ---------- COLD OPEN (intro scene, screen space) ----------
seg("Most of us only ever see one small corner of marketing: the adverts.",
    [("i_person", "Most"), ("i_tv", "adverts")], scene="intro")
seg("The billboard on the motorway, the jingle stuck in your head, "
    "and that strangely specific ad that follows you around the internet.",
    [("i_billboard", "billboard"), ("i_jingle", "jingle"), ("i_phone", "strangely")], scene="intro")
seg("But marketing as a whole is a huge and surprisingly scientific subject, "
    "and the adverts are just the tip of it.",
    [("i_iceberg", "tip")], scene="intro")
seg("So this is my attempt to show you all of it, in one map.",
    [], scene="intro")
seg("This is the map of marketing.", [("i_title", "map")], scene="intro", pause=0.8)

# ---------- ORIGINS ----------
seg("We'll start at the very beginning. Marketing is as old as trade itself.",
    [("origins_circle", "start"), ("o_market", "trade")], cam=["origins_circle"], scene="map")
seg("As soon as there were markets, there were people shouting about why their fish was the best fish.",
    [("o_fish", "shouting")], cam=["origins_circle"])
seg("In Pompeii, the walls were painted with adverts and election slogans.",
    [("o_pompeii", "Pompeii")], cam=["origins_circle"])
seg("Then came the printing press, and in around 1477 William Caxton printed one of the first adverts in English. "
    "It was for a book.",
    [("o_caxton", "printing")], cam=["origins_circle"])
seg("Newspapers brought classified ads, radio brought jingles, "
    "and in 1941 the first TV advert, for Bulova watches, cost about nine dollars.",
    [("o_radio", "radio"), ("o_tv", "1941")], cam=["origins_circle"])
seg("And in 1994 the first banner ad appeared on the web. Reportedly forty four percent of the people who saw it clicked on it, "
    "which these days is completely unheard of.",
    [("o_banner", "banner")], cam=["origins_circle"])
seg("Now, there's a lot more to the history than that, but I'm going to jump to marketing as we know it today.",
    [("origins_label", "history")], cam=[3050, 1480, 2200])

# ---------- THE SPLIT ----------
seg("Modern marketing can be broken down into four big areas.",
    [], cam=[3200, 1450, 6000])
seg("Strategy, which is deciding who you're talking to, and what you're offering them.",
    [("strategy_label", "Strategy")], regions=["strategy"], cam=[3200, 1450, 6000])
seg("Brand, which is what people think of when they hear your name.",
    [("brand_label", "Brand")], regions=["brand"], cam=[3200, 1450, 6000])
seg("Channels, which are all the ways you actually reach people.",
    [("channels_label", "Channels")], regions=["paid", "owned", "earned"], cam=[3200, 1450, 6000])
seg("And Growth, which is about measuring what works, and doing more of it.",
    [("growth_label", "Growth")], regions=["growth"], cam=[3200, 1450, 6000])
seg("There's a lot of crossover between them, and people argue about where the borders are, "
    "but it's a good place to start.",
    [], cam=[3200, 1450, 6000])

# ---------- STRATEGY ----------
seg("Strategy starts with market research: actually finding out what people want, instead of guessing.",
    [("s_research", "research")], cam=[900, 600, 2100])
seg("That means surveys, interviews, and simply watching how people behave, "
    "which is often very different to what they say.",
    [("s_saydo", "watching")], cam=[900, 600, 2100])
seg("Then comes segmentation: splitting a market into groups of people with similar needs.",
    [("s_segment", "segmentation")], cam=[1500, 600, 2100])
seg("Targeting is choosing which of those groups to go after.",
    [("s_target", "Targeting")], cam=[1700, 600, 2100])
seg("And positioning is deciding what you want to mean in their heads, compared to everyone else. "
    "Al Ries and Jack Trout made this idea famous in the 1970s.",
    [("s_position", "positioning")], cam=[1900, 650, 2100])
seg("Together these are called S T P, and it's one of the most useful ideas on the whole map.",
    [("s_stp", "Together")], cam=[1500, 700, 2400])
seg("A related idea is jobs to be done. People don't buy a drill because they want a drill. "
    "They buy it because they want a hole in the wall.",
    [("s_jtbd", "drill")], cam=[600, 1150, 2000])
seg("In 1960, Jerome McCarthy summed up the marketer's toolbox as the four P's: "
    "product, price, place, and promotion.",
    [("s_4p_title", "McCarthy"), ("s_p_product", "product"), ("s_p_price", "price,"),
     ("s_p_place", "place"), ("s_p_promo", "promotion")], cam=[1350, 1350, 2000])
seg("Product is what you make, place is where people can buy it, and promotion is how you tell them about it.",
    [], cam=[1350, 1350, 2000])
seg("Price is sneakier than it looks. A price ending in ninety nine feels cheaper than it is.",
    [("s_99", "ninety")], cam=[1900, 1300, 2000])
seg("And adding a decoy option that nobody really wants can make the option you do want look like a bargain.",
    [("s_decoy", "decoy")], cam=[1900, 1300, 2000])
seg("And notice that promotion, the bit everyone thinks of as marketing, is only one quarter of the toolbox.",
    [("s_quarter", "quarter")], cam=[1350, 1350, 2000])

# ---------- BRAND ----------
seg("Next door is Brand.", [], cam=[3350, 600, 2100])
seg("A brand is not just a logo. It's the whole bundle of memories and feelings "
    "that pop into your head when you hear a name.",
    [("b_head", "bundle")], cam=[3350, 600, 2100])
seg("That includes the visual identity, like the logo, colours and typefaces, "
    "and the brand voice, which is how it sounds when it talks.",
    [("b_identity", "identity"), ("b_voice", "voice")], cam=[3450, 550, 2100])
seg("Brand equity is the extra value that a name adds. "
    "It's why people pay more for the same thing with a famous label on it.",
    [("b_equity", "equity")], cam=[3300, 850, 2100])
seg("The researcher Byron Sharp argued that brands grow mostly by being easy to think of, "
    "and easy to buy. He called this mental and physical availability.",
    [("b_sharp", "Sharp")], cam=[3500, 850, 2100])
seg("Which is why famous brands keep reminding you they exist, even though you already know them. Memories fade.",
    [("b_remind", "reminding")], cam=[3500, 850, 2100])
seg("And brands tell stories, because we remember stories far better than we remember facts.",
    [("b_story", "stories")], cam=[3700, 900, 2100])

# ---------- CHANNELS ----------
seg("Now to Channels, the ways a message actually reaches you. "
    "These are often split into three territories: paid, owned, and earned media.",
    [("c_paid_label", "paid"), ("c_owned_label", "owned"), ("c_earned_label", "earned")],
    cam=[5300, 1200, 2700])
seg("Paid media is when you buy attention.", [], cam=[5150, 800, 2100])
seg("The traditional kind is print, radio, TV and billboards. Big, broad, and hard to measure.",
    [("c_trad", "traditional")], cam=[4950, 800, 2100])
seg("Then there's digital advertising. Search ads show up when you type something into a search engine, "
    "so they catch people right at the moment they want something.",
    [("c_search", "Search")], cam=[5350, 800, 2100])
seg("Display and social ads follow you around websites and feeds, "
    "targeted using huge amounts of data about who you are and what you've done.",
    [("c_social", "Display")], cam=[5550, 850, 2100])
seg("And influencer marketing is paying people that your audience already trusts to talk about you.",
    [("c_influencer", "influencer")], cam=[5700, 900, 2100])
seg("Owned media is the stuff you control yourself: your website, your email list, "
    "and content like blogs, videos and podcasts.",
    [("c_website", "website"), ("c_email", "email"), ("c_content", "content")], cam=[5250, 1400, 2100])
seg("Search engine optimisation, or S E O, is making that content easy to find, "
    "so people come to you without you paying for every visit.",
    [("c_seo", "optimisation")], cam=[5600, 1450, 2100])
seg("Content marketing is a slow game. You give away useful stuff for free, and over time people come to trust you. "
    "In fact, this video is a little bit of content marketing. Hello.",
    [("c_contentmkt", "slow"), ("c_thisvideo", "fact")], cam=[5450, 1500, 2100])
seg("Earned media is attention you can't buy. Public relations is getting journalists to write about you.",
    [("c_pr", "Public")], cam=[5300, 1950, 2100])
seg("Reviews and word of mouth are the most powerful of all, "
    "because people trust other people far more than they trust adverts.",
    [("c_reviews", "Reviews"), ("c_wom", "word")], cam=[5600, 1950, 2100])
seg("And every so often something goes viral, which everyone wants, "
    "and nobody really knows how to make happen on purpose.",
    [("c_viral", "viral")], cam=[5550, 2050, 2100])

# ---------- GROWTH ----------
seg("Which brings us to Growth, the most numerical part of the map.",
    [], cam=[2300, 2300, 2700])
seg("The classic model here is the funnel. It goes back to 1898, when Elias St. Elmo Lewis described A I D A: "
    "attention, interest, desire, and action.",
    [("g_funnel", "funnel")], cam=[950, 2350, 2000])
seg("Lots of people go in at the top, and only a few come out at the bottom as customers.",
    [("g_few", "few")], cam=[950, 2350, 2000])
seg("Modern versions add what happens after the sale, "
    "because keeping a customer is usually much cheaper than finding a new one.",
    [("g_after", "after")], cam=[950, 2350, 2000])
seg("Dave McClure's pirate metrics, A A R R R, track acquisition, activation, retention, referral and revenue.",
    [("g_pirate", "pirate")], cam=[1700, 2350, 2000])
seg("Two numbers sit at the heart of it all. Customer acquisition cost, or CAC, is how much it costs to win a customer. "
    "And lifetime value is how much that customer is worth over time.",
    [("g_cacltv", "Two")], cam=[2450, 2350, 2000])
seg("If the lifetime value isn't comfortably bigger than the cost, you have a problem, "
    "no matter how good your adverts look.",
    [("g_problem", "problem")], cam=[2450, 2350, 2000])
seg("Conversion rate optimisation tries to get more people through each step of the funnel.",
    [("g_cro", "Conversion")], cam=[3050, 2250, 2000])
seg("And the main tool for that is the A B test. Show half the people version A, and half version B, "
    "and let the data decide.",
    [("g_ab", "test")], cam=[3500, 2400, 2000])
seg("This is where marketing gets genuinely scientific, with hypotheses, experiments and statistics.",
    [("g_science", "scientific")], cam=[3800, 2400, 2000])
seg("There's also lifecycle marketing: welcome emails, reminders and loyalty schemes that keep people coming back.",
    [("g_lifecycle", "lifecycle")], cam=[4150, 2500, 2000])
seg("And here's a nice crossover with Brand. Les Binet and Peter Field found that the best results usually come from "
    "spending about sixty percent on long term brand building, and forty percent on short term sales activation.",
    [("g_6040", "sixty")], cam=[2200, 1750, 2400])

# ---------- BEDROCK ----------
seg("But underneath all four areas, there's a bedrock that everything else is built on: the human mind.",
    [("m_label", "bedrock")], regions=["bedrock"], cam=[3200, 2900, 3200])
seg("Because in the end, every bit of marketing is trying to change what's going on inside someone's head.",
    [], cam=[3200, 2900, 3200])
seg("In 1984 the psychologist Robert Cialdini described six principles of persuasion.",
    [("m_cialdini", "Cialdini")], cam=[1300, 3180, 2100])
seg("Reciprocity. We feel we owe people who give us something.",
    [("m_recip", "Reciprocity")], cam=[1300, 3180, 2100])
seg("Commitment. Once we say yes to something small, we like to stay consistent.",
    [("m_commit", "Commitment")], cam=[1300, 3180, 2100])
seg("Social proof. We copy what other people are doing.",
    [("m_social", "Social")], cam=[1500, 3180, 2100])
seg("Authority. We trust experts.",
    [("m_authority", "Authority")], cam=[1800, 3180, 2100])
seg("Liking. We say yes to people we like.",
    [("m_liking", "Liking")], cam=[2000, 3180, 2100])
seg("And scarcity. We want things more when there aren't many left.",
    [("m_scarcity", "scarcity")], cam=[2200, 3180, 2100])
seg("Daniel Kahneman and Amos Tversky showed that losing something hurts roughly twice as much "
    "as gaining the same thing feels good. Which is why 'don't miss out' works so well.",
    [("m_loss", "losing")], cam=[3700, 3180, 2100])
seg("The mere exposure effect means that simply seeing something again and again makes us like it more. "
    "Which explains rather a lot about adverts.",
    [("m_exposure", "exposure")], cam=[4500, 3180, 2100])
seg("And Kahneman described two systems of thinking: a fast automatic one, and a slow careful one. "
    "Most buying decisions happen in the fast one.",
    [("m_systems", "two")], cam=[5450, 3180, 2100])

# ---------- EDGES ----------
seg("So that's the main map. But there are still big unknowns at the edges.",
    [], cam=[3200, 1800, 6400])
seg("Out here is the Fog of Attribution.",
    [("f_label", "Fog")], regions=["fog"], cam=[5450, 2550, 2100])
seg("The department store owner John Wanamaker is supposed to have said: "
    "half the money I spend on advertising is wasted. The trouble is, I don't know which half.",
    [("f_quote", "Wanamaker")], cam=[5300, 2550, 2100])
seg("Over a hundred years later, that's still surprisingly hard. "
    "If someone sees an advert on TV, searches on their phone, and buys on their laptop a week later, "
    "which bit of the marketing gets the credit?",
    [("f_path", "TV")], cam=[5650, 2600, 2100])
seg("There are attribution models, like first click and last click, and clever statistics like marketing mix modelling, "
    "but none of them fully clears the fog.",
    [("f_models", "models")], cam=[5450, 2650, 2100])
seg("And floating above it all is a cloud of big questions: ethics.",
    [("e_cloud", "floating"), ("e_label", "ethics")], cam=[5550, 300, 2100])
seg("Where is the line between persuasion and manipulation?",
    [("e_line", "line")], cam=[5550, 300, 2100])
seg("How much should companies know about us? Privacy laws like G D P R are still redrawing this part of the map.",
    [("e_privacy", "Privacy")], cam=[5550, 300, 2100])
seg("Dark patterns are designs that trick you, "
    "like a subscription that takes one click to start and twelve clicks to cancel.",
    [("e_dark", "Dark")], cam=[5550, 300, 2100])
seg("And now A I can write, design and personalise an advert for every single person, "
    "so nobody knows quite what this map will look like in ten years.",
    [("e_ai", "write")], cam=[5550, 300, 2100])

# ---------- OUTRO ----------
seg("So that is the map of marketing.", [("sig", "map")], cam=[3200, 1800, 6400], pause=1.2)
seg("The thing I find most interesting about it is that underneath all the jargon, it's really the study of people: "
    "what we want, what we notice, what we trust, and what we remember.",
    [], cam=[3200, 1800, 6400])
seg("And once you've seen the map, you start noticing it everywhere. The decoy on the menu, "
    "the 'only two left' on the booking site, the brand you picked without really thinking about it.",
    [], cam=[3200, 1800, 6400])
seg("At its best, marketing is just helping the right people find something that's genuinely good for them. "
    "And the rest of the map is how you do that.",
    [], cam=[3200, 1800, 6400])
seg("Thanks for watching.", [], cam=[3200, 1800, 6400], pause=3.0)

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "narration_script.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(S, f, indent=1)
    words = sum(len(s["text"].split()) for s in S)
    print(len(S), "segments,", words, "words")
