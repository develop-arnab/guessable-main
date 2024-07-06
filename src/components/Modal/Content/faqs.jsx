import { Collapse } from "antd";

const Faq = () => {
  const faqCountry = [
    {
      key: "1",
      label: "What is Country Guesser all about?",
      children: (
        <p>
          It&apos;s a simple country guessing game - you have to guess which
          country is being talked about in the clue. Select your best guess in
          the dropdown and submit to check whether you got it right.
        </p>
      ),
    },
    {
      key: "2",
      label: "What are adjectivals and demonyms?",
      children: (
        <p>
          A country adjective describes something as being from that country,
          for example, &quot;Italian cuisine&quot; is &quot;cuisine of
          Italy&quot;. A country demonym denotes the people or the inhabitants
          of or from there; for example, &quot;Germans&quot; are people of or
          from Germany. These are usually dead giveaways hence they&apos;re
          removed from the text. See more{" "}
          <a
            href="https://en.wikipedia.org/wiki/List_of_adjectival_and_demonymic_forms_for_countries_and_nations"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
      ),
    },
    {
      key: "3",
      label: "What is the source of the data?",
      children: (
        <p>
          The clues are from the primary Wikipedia page of the country (and
          sometimes from related articles directly linked with this page). GDP
          data is from{" "}
          <a
            href="https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          . Population data is from{" "}
          <a
            href="https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          . Time zones are from{" "}
          <a
            href="https://en.wikipedia.org/wiki/List_of_time_zones_by_country"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          . Any mistakes are unintentional and inclusions or omissions are not a
          political statement of any kind.
        </p>
      ),
    },
    {
      key: "4",
      label: "Share Feedback",
      children: (
        <p>
          Like Guessable? Don&apos;t like it? Have an idea to make it better?
          Want to suggest a question? Please write to me at{" "}
          <a href="mailto:web.belphi@gmail.com">web.belphi@gmail.com</a>
        </p>
      ),
    },
  ];
  const faqMovie = [
    {
      key: "1",
      label: "What is Movie Guesser all about?",
      children: (
        <p>
          It&apos;s a simple movie guessing game - you have to guess which
          movie&apos;s plot summary is given in the clue. Select your best guess
          in the dropdown and submit to check whether you got it right.
        </p>
      ),
    },
    {
      key: "2",
      label:
        "What is the source of the data? Why can't I see some movies in the dropdown?",
      children: (
        <p>
          The source of all data is IMDb, as of December 2023. The list of
          movies has been filtered based on a minimum popularity on IMDb, i.e. a
          minimum number of people need to have rated the movie for it to
          qualify.
        </p>
      ),
    },
    {
      key: "3",
      label: "Share Feedback",
      children: (
        <p>
          Like Guessable? Don&apos;t like it? Have an idea to make it better?
          Want to suggest a question? Please write to me at{" "}
          <a href="mailto:web.belphi@gmail.com">web.belphi@gmail.com</a>
        </p>
      ),
    },
  ];
  return (
    <>
      <div className="text-center font-[700] text-[20px] my-4 font-poppins">
        FAQs
      </div>
      <Collapse
        accordion
        items={
          localStorage.getItem("current_tab")
            ? localStorage.getItem("current_tab") === "countries"
              ? faqCountry
              : faqMovie
            : faqCountry
        }
        defaultActiveKey="1"
      />
    </>
  );
};

export default Faq;
