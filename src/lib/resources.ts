export type ResourceBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: ReadonlyArray<string> }
  | { type: "steps"; items: ReadonlyArray<{ title: string; detail: string }> }
  | { type: "note"; text: string };

export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  product: "schemeknit" | "maacash" | "tillproof";
  published: string;
  updated: string;
  readingMinutes: number;
  blocks: ReadonlyArray<ResourceBlock>;
};

export const RESOURCES: ReadonlyArray<ResourceArticle> = [
  {
    slug: "scheme-of-learning-to-weekly-lesson-plans",
    title: "How to turn a scheme of learning into weekly lesson plans",
    description:
      "A practical, indicator-first method for turning a term scheme of learning into weekly lesson plans that a teacher can actually teach and defend.",
    category: "Teaching practice",
    product: "schemeknit",
    published: "2026-11-09",
    updated: "2026-11-09",
    readingMinutes: 9,
    blocks: [
      {
        type: "paragraph",
        text: "A scheme of learning answers a broad question: what should this class cover across the term? A lesson plan answers a narrower one: what should happen in this week, with these learners, in this time? The gap between the two is where most planning time disappears.",
      },
      {
        type: "paragraph",
        text: "The method below keeps the scheme as the source of truth and builds each plan around a single learning indicator. It works on paper, in a document, or in a planning tool. The point is not to produce more paper. The point is to produce a plan that matches what will be taught and what will be assessed.",
      },
      {
        type: "heading",
        text: "1. Read the scheme as a sequence, not a list",
      },
      {
        type: "paragraph",
        text: "Start with the whole term. Read the strands and sub-strands in order, then the content standards and the indicators beneath them. You are looking for the story of the term: which ideas build on earlier ideas, where a practical activity carries most of the learning, and where a topic needs more than one lesson.",
      },
      {
        type: "paragraph",
        text: "A common mistake is to treat every row as one lesson. Some indicators need a single period. Others need two or three, especially where learners must practise a skill or complete a project. Decide this before you write any plan.",
      },
      {
        type: "heading",
        text: "2. Map the weeks to real teaching time",
      },
      {
        type: "paragraph",
        text: "Count the periods you actually have, not the periods in an ideal timetable. Subtract examination weeks, public holidays, sports days and any known interruption. Mark double periods and the days when the class is tired or the room is unavailable.",
      },
      {
        type: "paragraph",
        text: "This step prevents the most common planning failure: a term's work squeezed into fewer weeks than the scheme assumes. It is better to combine two light indicators deliberately than to discover in week nine that four topics remain.",
      },
      {
        type: "heading",
        text: "3. Turn each indicator into one lesson objective",
      },
      {
        type: "paragraph",
        text: "The indicator states what the learner should be able to demonstrate. Write the lesson objective in learner language, using a verb you can observe: identify, compare, measure, construct, explain, solve. If you cannot picture the evidence, the objective is still too vague.",
      },
      {
        type: "paragraph",
        text: "Keep the indicator reference beside the objective. It is the thread between the curriculum, the lesson and the assessment. When a supervisor asks why a topic is being taught, the answer should be visible on the page.",
      },
      {
        type: "heading",
        text: "4. Choose teaching and learning resources that exist",
      },
      {
        type: "paragraph",
        text: "List the resources you can actually use: the textbook page, a chart already in the classroom, a local material, a shared device, a printed worksheet. A plan that depends on a projector in a room without one is not a plan; it is a wish.",
      },
      {
        type: "paragraph",
        text: "Where a resource is scarce, design the lesson around groups or a demonstration. Record who carries what, so the activity does not collapse at the start of the period.",
      },
      {
        type: "heading",
        text: "5. Build the lesson in phases",
      },
      {
        type: "steps",
        items: [
          {
            title: "Starter",
            detail:
              "Recall what the previous lesson established and surface a misconception. Keep it short and make every learner respond, verbally or in writing.",
          },
          {
            title: "Main activity",
            detail:
              "Teach the new idea, then give learners a task that produces evidence of the objective. Write both the teacher action and the learner action.",
          },
          {
            title: "Assessment",
            detail:
              "Decide how you will know the objective was met during the lesson, not only at the end of the term. A short set of questions, a practical check or a written response is enough.",
          },
          {
            title: "Conclusion",
            detail:
              "Return to the objective. Ask learners to state what they can now do, and link forward to the next indicator.",
          },
        ],
      },
      {
        type: "heading",
        text: "6. Review the plan against the indicator",
      },
      {
        type: "paragraph",
        text: "Read the completed plan once with a single question: does every activity move a learner towards this indicator? Remove anything that is merely interesting. Add anything that is missing, especially the assessment evidence.",
      },
      {
        type: "paragraph",
        text: "Check the core competencies too. Collaboration, critical thinking, communication and creativity are not separate subjects; they are behaviours the task should require. If the plan says learners will collaborate, the task must give them a reason to depend on one another.",
      },
      {
        type: "heading",
        text: "7. Keep a weekly review loop",
      },
      {
        type: "paragraph",
        text: "At the end of the week, note what actually happened. Which indicator took longer? Which task produced weak evidence? Which resource failed? Carry that note into the next week's plan instead of starting from a blank page.",
      },
      {
        type: "paragraph",
        text: "This small habit is what turns a template into professional judgement. The scheme stays stable; the plan learns from the classroom.",
      },
      {
        type: "heading",
        text: "Common mistakes and a better habit",
      },
      {
        type: "list",
        items: [
          "Copying the content standard into the objective. A standard describes the destination; an objective describes what this lesson will produce.",
          "Planning three indicators for one period. Depth beats coverage when the indicator will be assessed.",
          "Listing resources without checking availability. Confirm the textbook, the chart and the room before the week starts.",
          "Leaving assessment to the end of the term. Build a small evidence point into every lesson.",
          "Rewriting the whole scheme each week. Keep the scheme, adjust the plan.",
        ],
      },
      {
        type: "note",
        text: "SchemeKnit is built around this workflow: upload a scheme, review the extracted structure, generate plans around the stated indicators, edit them, and export. It is a planning tool, not an official curriculum publication, and it is not endorsed by NaCCA or the Ghana Education Service.",
      },
      {
        type: "paragraph",
        text: "The test of a lesson plan is simple. Could another teacher pick it up and teach the same indicator without asking what you meant? If yes, the plan is doing its job.",
      },
    ],
  },
  {
    slug: "mobile-money-business-recordkeeping",
    title: "Recordkeeping for a mobile money business: a daily routine that works",
    description:
      "A daily routine for mobile money agents and multi-location operators: opening position, transaction records, float and reconciliation.",
    category: "Business operations",
    product: "maacash",
    published: "2026-11-09",
    updated: "2026-11-09",
    readingMinutes: 10,
    blocks: [
      {
        type: "paragraph",
        text: "A mobile money business handles two kinds of money at the same time. There is cash in the drawer and electronic value in the float. A transaction moves one against the other. When the records only capture the total at the end of the day, it becomes impossible to say which transaction, which customer or which staff member created a difference.",
      },
      {
        type: "paragraph",
        text: "The routine below is deliberately ordinary. It is designed to be repeated every day by people who are busy serving customers, not by an accountant at the end of the month.",
      },
      {
        type: "heading",
        text: "Start with an opening position",
      },
      {
        type: "paragraph",
        text: "Before the first customer, record three figures: cash on hand, electronic float, and any pending obligations such as a customer waiting for a reversal. Both the person on duty and the person handing over should see the same figures. A disagreement at opening is much cheaper to resolve than a disagreement at closing.",
      },
      {
        type: "paragraph",
        text: "If the business runs several locations, each location needs its own opening position. A single organisation-wide total hides the branch that is short.",
      },
      {
        type: "heading",
        text: "Record the transaction, not just the total",
      },
      {
        type: "paragraph",
        text: "For each transaction, capture enough detail to answer a customer query without guesswork:",
      },
      {
        type: "list",
        items: [
          "Date and time.",
          "Customer name or a consistent customer reference.",
          "Transaction type: deposit, withdrawal, transfer, bill payment, airtime, or another supported service.",
          "Amount and the applicable charge.",
          "The location and the staff member who handled it.",
          "A provider reference or receipt number where one exists.",
          "The resulting cash and float position, where the system can calculate it.",
        ],
      },
      {
        type: "paragraph",
        text: "Totals are a summary, not a record. If the only entry for the day is a lump sum, a customer dispute or a staff query cannot be investigated later.",
      },
      {
        type: "heading",
        text: "Keep business money separate from personal money",
      },
      {
        type: "paragraph",
        text: "The fastest way to lose control is to use the till for personal expenses and replace it later. Every withdrawal from the business, including the owner's own, should be recorded as a withdrawal with a reason. That single rule makes the closing figure meaningful.",
      },
      {
        type: "heading",
        text: "Reconcile at closing, not at the end of the month",
      },
      {
        type: "steps",
        items: [
          {
            title: "Count the cash",
            detail:
              "Count the physical cash in the presence of a second person where possible, and write the figure down before checking the expected balance.",
          },
          {
            title: "Check the float",
            detail:
              "Compare the electronic balance with the platform or provider record. Note any transaction still pending.",
          },
          {
            title: "Explain every difference",
            detail:
              "A difference is not automatically a loss. It may be an unrecorded charge, a pending reversal or a transaction entered twice. Record the explanation and who gave it.",
          },
          {
            title: "Close the day",
            detail:
              "Lock the day's records, carry the closing position to the next opening, and keep the summary with the transaction detail.",
          },
        ],
      },
      {
        type: "heading",
        text: "Handle susu collections as a separate ledger",
      },
      {
        type: "paragraph",
        text: "Where the business also runs susu collections, keep the collection records distinct from mobile money transactions. Each collector needs an assigned customer list, a record of what was expected, what was collected and what was handed over. The end-of-day question is not only how much was collected, but which customer payments make up that total.",
      },
      {
        type: "paragraph",
        text: "A collector's route changes. Customers miss a day. A partial payment is agreed. The record must allow those realities without losing the link between the customer and the money.",
      },
      {
        type: "heading",
        text: "Review the week, not only the day",
      },
      {
        type: "paragraph",
        text: "Once a week, compare the recorded transactions with the provider statement or platform report. Look for three things: transactions recorded in one place but not the other, charges that do not match the published rate, and repeated small differences at the same location or with the same staff member.",
      },
      {
        type: "paragraph",
        text: "This review is where patterns appear. A daily difference may be an error. The same difference every Friday is a process problem.",
      },
      {
        type: "heading",
        text: "Common recordkeeping mistakes",
      },
      {
        type: "list",
        items: [
          "Recording only the day's total, which makes individual transactions impossible to trace.",
          "Letting staff share a login, which removes accountability without improving speed.",
          "Treating float and cash as one number.",
          "Failing to record reversals and pending transactions.",
          "Keeping customer data in a personal phone with no backup and no access control.",
          "Reconciling only when something goes wrong.",
        ],
      },
      {
        type: "note",
        text: "MaaCash records and administers operations across locations, staff roles, mobile-money workflows and susu collection. It is not a bank or a licensed deposit-taking institution, and it does not hold customer funds. Integration and feature availability depend on the deployment. Keep the records your provider and the applicable regulations require; this article is operational guidance, not legal advice.",
      },
      {
        type: "paragraph",
        text: "Good recordkeeping does not make a business slower. It makes the difficult conversation shorter, because the answer is already written down.",
      },
    ],
  },
  {
    slug: "electrical-shop-stock-control",
    title: "Stock control for electrical shops: item codes, counts and accountability",
    description:
      "How electrical retailers can organise item codes, receiving, transfers, pricing and cycle counts so that the stock record matches the shelf.",
    category: "Retail operations",
    product: "tillproof",
    published: "2026-11-09",
    updated: "2026-11-09",
    readingMinutes: 9,
    blocks: [
      {
        type: "paragraph",
        text: "An electrical shop is not a simple inventory. Cable is sold by the metre, breakers by rating and pole, sockets by type and finish, and fittings that look alike can carry different ratings. A stock record that treats all of them as “electrical items” will drift from the shelf within a week.",
      },
      {
        type: "paragraph",
        text: "The aim of stock control is not a perfect spreadsheet. It is a record that answers three questions quickly: what is here, where is it, and who moved it?",
      },
      {
        type: "heading",
        text: "Give every item a stable code",
      },
      {
        type: "paragraph",
        text: "Start with a code that does not change when the price changes or the supplier changes. A category prefix, a short description and a variant is enough: for example, a breaker code that records the rating and the pole count, or a cable code that records the conductor size and the length unit.",
      },
      {
        type: "paragraph",
        text: "Record the unit of measure with the code. Cable may be stocked in rolls and sold in metres. A code that does not state the unit invites a costly conversion error.",
      },
      {
        type: "list",
        items: [
          "One code per sellable variant, not one code per supplier invoice line.",
          "A description a new staff member can match to the shelf.",
          "A unit of measure and, where relevant, the pack size.",
          "A reorder level based on normal sales, not on a guess.",
        ],
      },
      {
        type: "heading",
        text: "Record stock at receiving",
      },
      {
        type: "paragraph",
        text: "When goods arrive, count them before they reach the shelf. Record the supplier, the invoice or delivery note, the quantity received, the cost and any shortage or damage. If the count happens later, the delivery and the shelf become two separate stories.",
      },
      {
        type: "paragraph",
        text: "Where the same item comes from two suppliers at different costs, keep the cost attached to the receipt. A single average cost hides which supplier is actually cheaper.",
      },
      {
        type: "heading",
        text: "Give every location a name",
      },
      {
        type: "paragraph",
        text: "A shop floor, a store room and a second branch are different locations. Transfers between them should be recorded as transfers, not as a sale and a purchase. Otherwise the total stock looks correct while each location is wrong.",
      },
      {
        type: "heading",
        text: "Update the record at the point of sale",
      },
      {
        type: "paragraph",
        text: "A stock record updated at the end of the day depends on someone remembering every sale. Update at the moment of sale, even if the update is a simple entry on a phone or a till. The closer the record is to the transaction, the smaller the gap at closing.",
      },
      {
        type: "paragraph",
        text: "For items sold by length or partial quantity, record the quantity sold rather than the number of pieces. A roll of cable that leaves the store should reduce the metres, not the roll count.",
      },
      {
        type: "heading",
        text: "Control prices from one place",
      },
      {
        type: "paragraph",
        text: "Decide who may change a price. Record the old price, the new price, the date and the person who approved it. This is not bureaucracy; it is the difference between a discount and an unexplained margin loss.",
      },
      {
        type: "paragraph",
        text: "Keep a current price list where staff can see it. If a price is negotiated for a customer, record the reason and the approver.",
      },
      {
        type: "heading",
        text: "Make cash accountable by shift",
      },
      {
        type: "paragraph",
        text: "At the start of a shift, record the opening float. At the end, count the cash and compare it with sales, refunds and any expenses paid from the till. The person responsible should sign or confirm the closing figure.",
      },
      {
        type: "paragraph",
        text: "A difference is information. Record it, explain it and look for a pattern. Punishing every small difference without investigating it teaches staff to hide differences instead of reporting them.",
      },
      {
        type: "heading",
        text: "Count in cycles",
      },
      {
        type: "steps",
        items: [
          {
            title: "Weekly sample count",
            detail:
              "Count a rotating selection of high-value or fast-moving categories. Compare the count with the record and investigate the largest differences first.",
          },
          {
            title: "Monthly category count",
            detail:
              "Count one full category, such as breakers or sockets. This catches mis-picks and units errors without stopping the whole shop.",
          },
          {
            title: "Full count",
            detail:
              "Do a complete count less often, with a clear cut-off: no sales or transfers while the count is open, or a documented way to adjust for them.",
          },
        ],
      },
      {
        type: "heading",
        text: "Common stock-control mistakes",
      },
      {
        type: "list",
        items: [
          "Using the supplier's description as the item name, so the same item appears under several names.",
          "Recording only quantity and not location.",
          "Treating a transfer as a sale.",
          "Allowing price changes without a record.",
          "Counting stock without stopping movement, then adjusting the record to match the count.",
          "Keeping the stock record in one person's memory.",
        ],
      },
      {
        type: "note",
        text: "TillProof is in development. It is intended to give electrical retailers remote owner visibility, controlled pricing, cash accountability and traceable stock across locations. There is no public TillProof application, and this article describes operational practice rather than a released feature set.",
      },
      {
        type: "paragraph",
        text: "The measure of a stock system is not how much it records. It is whether a staff member can find the truth in it during a busy day, and whether the owner can trust the number without standing in the shop.",
      },
    ],
  },
];

export const RESOURCE_CATEGORIES = Array.from(new Set(RESOURCES.map((item) => item.category)));

export function getResource(slug: string) {
  return RESOURCES.find((item) => item.slug === slug);
}

export function relatedResources(slug: string, limit = 2) {
  return RESOURCES.filter((item) => item.slug !== slug).slice(0, limit);
}
