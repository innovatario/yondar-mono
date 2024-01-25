import { WavyText } from "./WavyText"
import "../scss/FAQ.scss"
import { GeoChatExampleButton } from "./GeoChatExampleButton"
import { SignUpButton } from "./SignUpButton"
import { AddExampleButton } from "./AddExampleButton"
import { FormattedMessage } from 'react-intl'

const Goolag = () => (
  <>
    <span className="blue">G</span>
    <span style={{ color: "red" }}>o</span>
    <span style={{ color: "yellow" }}>o</span>
    <span className="blue">l</span>
    <span style={{ color: "#93e930" }}>a</span>
    <span style={{ color: "red" }}>g</span>
  </>
)

const Geochat = () => <span style={{ color: "#d3baf3" }}><WavyText text="Geochat" /></span>

export const FAQ = () => {
  return (
    <div className="faq mt-0">
      <p className="send">
        <FormattedMessage
          id="q1"
          description="Q1"
          defaultMessage="What can I do with Yondar? "
        />
        <span role="img" aria-label="smile">
          😃
        </span>{" "}
      </p>
      <p className="receive">
        <span role="img" aria-label="thumbs up">
          👍
        </span>{" "}
        <FormattedMessage
          id="a1"
          description="A1"
          defaultMessage="You can publish places on a decentralized map for the world to see!"
        />
      </p>
      {/* <p className="receive">
        <FormattedMessage
          description="explanation"
          defaultMessage="Just tap the map 🗺️ and hit this button:"
        />
        <br />
        <br />
        <AddExampleButton />
      </p> */}
      {/* <p className="send">
        <FormattedMessage
          id="q2"
          description="Q2"
          defaultMessage="Is it like putting a business on" /><Goolag /> Maps?</p>
      <p className="receive">
        <FormattedMessage
          id="a2"
          description="A2"
          defaultMessage="Yeah, but without the"
        /> <Goolag />!
      </p>
      <p className="send">
        Nice!&nbsp;
        <span role="img" aria-label="smile">
          😂🤙
        </span>
      </p>

      <p className="receive">
        <FormattedMessage
          id="a2-e"
          description="A2e"
          defaultMessage="The Yondar map is a social place too 😆📢"
        />
      </p>
      <p className="receive">
        <GeoChatExampleButton />
        <br />
        <Geochat />
        <FormattedMessage
          id="a2-e2"
          description="A2e2"
          defaultMessage="lets you share posts or chat with others based on your geographic area! 🌎"
        />
      </p>
      <p className="send">
        <FormattedMessage
          id="q3"
          description="Q3"
          defaultMessage="That sounds cool, but what about privacy? 🤔"
        />
      </p>
      <p className="receive">
        <FormattedMessage
          id="a4"
          description="A4"
          defaultMessage="Since "
        />
        <Geochat />
        <FormattedMessage
          id="a4-1"
          description="A4-1"
          defaultMessage="is based on regions, no precise personal location is shared. Also, chat is optional!"
        />
      </p>
      <p className="send">
        <FormattedMessage
          id="q5"
          description="Q5"
          defaultMessage="Introvert friendly! 🤓"
        />

      </p>
      <p className="receive">
        <FormattedMessage
          id="a5"
          description="A5"
          defaultMessage="You can also see Places owned by your friends 🤗 and follows 🫡 on"
        />
        <a href="https://heynostr.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ae6cff' }}>nostr</a>! 🫂
      </p>
      <p className="send">
        <FormattedMessage
          id="a6"
          description="A6"
          defaultMessage="TOASTR? 😮🍞🔥"
        />
      </p>
      <p className="receive">
        <FormattedMessage
          id="a7"
          description="A7"
          defaultMessage="No, NOSTR! 🤦‍♂️ It's a new "
        />
        <a href="https://heynostr.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ae6cff' }}>
          <FormattedMessage
            id="a8"
            description="A8"
            defaultMessage="social internet"
          /></a>
        <FormattedMessage
          id="a9"
          description="A9"
          defaultMessage="that makes new kinds of apps possible!"
        />
      </p>
      <p className="send">
        <FormattedMessage
          id="q9"
          description="Q9"
          defaultMessage="That sounds fun! Do I need an account? ✍"
        />

      </p>
      <p className="receive">
        Boom:&nbsp;
        <SignUpButton />
        <br />
        <br />
        <FormattedMessage
          id="a10"
          description="A10"
          defaultMessage="It's all anonymous 🎭 unless you want to fill out your profile."
        />

        <br />
        <br />
        <FormattedMessage
          id="a11"
          description="A11"
          defaultMessage="With one click you can have a new account and join the fun!"
        />

        <br />
        <br />
        <FormattedMessage
          id="a12"
          description="A12"
          defaultMessage="Or sign in if you're a nostr user already."
        />

      </p>

      <p className="send">
        <FormattedMessage
          id="a13"
          description="A13"
          defaultMessage="Wow that's amazing! What does my account do? 💪"
        />

      </p>

      <p className="receive">
        <FormattedMessage
          id="a14"
          description="A14"
          defaultMessage="It allows you to create places 📍, edit them, and post in "
        />
        <Geochat />
        <br />
        <br />
        <FormattedMessage
          id="a15"
          description="A15"
          defaultMessage="Then you can take your identity to any other "
        />
        <a href="https://nostrapps.com" target="_blank" rel="noopener noreferrer" >
          <FormattedMessage
            id="a16"
            description="A16"
            defaultMessage="nostr-compatible app"
          /></a>
        <FormattedMessage
          id="a17"
          description="A17"
          defaultMessage="and use it there too! That's the superpower of the nostr protocol!"
        />
        <br />
        <br />
        <FormattedMessage
          id="a18"
          description="A18"
          defaultMessage="If you already have a nostr id, you can use it through a browser extension like "
        />
        <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">Alby on Desktop</a>, <a href="https://apps.apple.com/us/app/nostore/id1666553677" target="_blank" rel="noopener noreferrer">Nostore for iOS</a>, or <a href="https://github.com/nostrband/nostr-universe/releases/tag/v0.1.4" target="_blank" rel="noopener noreferrer">Spring browser for Android</a>.
      </p>

      <p className="send">
        <FormattedMessage
          id="q18"
          description="Q18"
          defaultMessage="What is my location used for? 🤔"
        />

      </p>
      <p className="receive">
        <FormattedMessage
          id="a19"
          description="A19"
          defaultMessage="Your GPS location simply shows where you are on the map in relation to other places. It can be helpful if you want to put a new place right where you are! 🎯"
        />

        <br />
        <br />
        <FormattedMessage
          id="a20"
          description="A20"
          defaultMessage="Your location is not transmitted, and our code is"
        />
        <a href="https://github.com/innovatario/yondar-mono.git" target="_blank" rel="noopener noreferrer">open-sourced</a> to prove it. <a href="https://innovatar.io" target="_blank" rel="noopener noreferrer">We are</a>
        <FormattedMessage
          id="a21"
          description="A21"
          defaultMessage="regular people who value our privacy, so we built Yondar to do the same for you. ✅"
        />
      </p>

      <p className="send">
        <span role="img" aria-label="money face">
          🤑
        </span>{" "}
        <FormattedMessage
          id="q22"
          description="Q22"
          defaultMessage="Is Yondar free?"
        />

      </p>
      <p className="receive">
        <FormattedMessage
          id="a23"
          description="a23"
          defaultMessage="Yes! Using Yondar is"
        />
        <WavyText text="totally free." />
        <FormattedMessage
          id="a24"
          description="A24"
          defaultMessage="We make our money
          by charging businesses"
        />{" "}
        <span role="img" aria-label="business">
          🏢
        </span>{" "}
        <FormattedMessage
          id="a24-1"
          description="A24-1"
          defaultMessage="to create custom Yondar experiences 🎁🎡🗺"
        />

      </p>
      <p className="receive">
        <FormattedMessage
          id="a25"
          description="A25"
          defaultMessage="Do you want to gamify👾🕹 your event or attraction and help your visitors
          find what they need? Do you host more than 10,000 people at your
          destination?"
        />
        {" "}
        <a
          href="https://innovatar.io/yondar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage
            id="a26"
            description="A26"
            defaultMessage="Contact us"
          />

        </a>{" "}
        <FormattedMessage
          id="a27"
          description="A27"
          defaultMessage="to see how we can improve your visitor experience, monetization, and
          safety!"
        />

      </p>

      <p className="send">
        <FormattedMessage
          id="q28"
          description="Q28"
          defaultMessage="What is "
        />
        <a href=" https://yondar.me">https://yondar.me</a>

        <FormattedMessage
          id="q28-1"
          description="Q28-1"
          defaultMessage="? Is it a different app?"
        />
      </p>

      <p className="receive">
        <FormattedMessage
          id="a28"
          description="A28"
          defaultMessage="Yondar.me started out as a centralized web2 PWA, but go.yondar.me is our new decentralized version of Yondar built on the nostr protocol!"
        />

        <br />
        <br />
        <FormattedMessage
          id="a28-1"
          description="A28-1"
          defaultMessage="Once go.yondar.me reaches feature parity with yondar.me, we will shut down the old Yondar and replace it with the new nostr-powered Yondar! Nostr is the future and we are excited to be a part of it! 🚀"
        />

      </p>

      <p className="send">
        <FormattedMessage
          id="a29"
          description="A29"
          defaultMessage="ok cool! thnx"
        />
      </p>
      <p className="receive">
        np{" "}
        <span role="img" aria-label="wave">
          👋
        </span>{" "}
        <FormattedMessage
          id="a30"
          description="A30"
          defaultMessage="have fun!"
        />

      </p> */}
    </div>
  )
}
