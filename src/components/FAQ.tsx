import { WavyText } from "./WavyText"
import "../scss/FAQ.scss"

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

export const FAQ = () => {
  return (
    <div className="faq mt-0">
      <p className="send">
        What can I do with Yondar?{" "}
        <span role="img" aria-label="smile">
          😃
        </span>
      </p>
      <p className="receive">
        <span role="img" aria-label="thumbs up">
          👍
        </span>{" "}
        You can publish your business, event, or attraction on a decentralized global map for the world to see! 
      </p>
      <p className="send">Is it like putting a business on <Goolag/> Maps?</p>
      <p className="receive">
        Yeah, but without the <Goolag />!
        <br />
        <br />
        You can also see Places owned by the people you follow on <a href="https://heynostr.com" target="_blank" rel="noopener noreferrer">nostr</a>.
        <br />
        <br />
        More exciting features are coming too, like end-to-end encrypted
        location sharing!
      </p>

      <p className="send">
        That sounds fun! Why do I need to sign in? ✍
      </p>

      <p className="receive">
        Yondar is a social map experience, but to interact you need to have a <a href="https://heynostr.com" target="_blank" rel="noopener noreferrer">nostr</a> identity, which is just a really long unguessable number.
        <br/>
        <br/>
        Using magical mathematics ✨🧙‍♂️ you can create Places that you have provable ownership of, and nobody can fake it or take it away from you!
      </p>

      <p className="send">
        Wow that's amazing! How do I get a nostr id? 🕵️‍♂️
      </p>

      <p className="receive">
        Yondar can generate one for you. Then you can take your identity to any other <a href="https://nostrapps.com" target="_blank" rel="noopener noreferrer" >nostr-compatible app</a> and use it there too! That's the superpower of the nostr protocol!
        <br/>
        <br/>
        If you already have a nostr id, you can use it through a browser extension like <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">Alby on Desktop</a>, <a href="https://apps.apple.com/us/app/nostore/id1666553677" target="_blank" rel="noopener noreferrer">Nostore for iOS</a>, or <a href="https://github.com/nostrband/nostr-universe/releases/tag/v0.1.4" target="_blank" rel="noopener noreferrer">Spring browser for Android</a>.
      </p>

      <p className="send">
        What is my location used for? 🤔 Is Yondar private and secure?
      </p>
      <p className="receive">
        Yes! Your personal GPS location simply shows where you are on the map in relation to other Places. It can be helpful if you want to put a new Place right where you are!
        <br/>
        <br/>
        Your location is not transmitted, and our code will soon be open-sourced to prove it. <a href="https://innovatar.io" target="_blank" rel="noopener noreferrer">We are</a> regular people who value our privacy, so we built Yondar to do the same for you. ✅
      </p>

      <p className="send">
        <span role="img" aria-label="money face">
          🤑
        </span>{" "}
        Is Yondar free?
      </p>
      <p className="receive">
        Yes! Using Yondar is <WavyText text="totally free." /> We make our money
        by charging businesses{" "}
        <span role="img" aria-label="business">
          🏢
        </span>{" "}
        to create custom Yondar experiences 🎁🎡🗺
      </p>
      <p className="receive">
        Do you want to gamify👾🕹 your event or attraction and help your visitors
        find what they need? Do you host more than 10,000 people at your
        destination?{" "}
        <a
          href="https://innovatar.io/yondar"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact us
        </a>{" "}
        to see how we can improve your visitor experience, monetization, and
        safety!
      </p>

      <p className="send">
        Does Yondar work indoors?{" "}
        <span role="img" aria-label="house">
          🏡
        </span>
      </p>
      <p className="receive">
        Yondar is meant for outdoor use{" "}
        <span role="img" aria-label="sun">
          🌞
        </span>
        <span role="img" aria-label="cloud">
          ☁
        </span>{" "}
        GPS technology has trouble when there is stuff between you and the sky{" "}
        <span role="img" aria-label="satelite dish">
          📡
        </span>
        <span role="img" aria-label="satelite">
          🛰
        </span>{" "}
        so keep that sky in view!
      </p>

      <p className="send">What is <a href="https://yondar.me">https://yondar.me</a>? Is it a different app?</p>

      <p className="receive">Yondar.me started out as a centralized web2 PWA, but go.yondar.me is our new decentralized and end-to-end encrypted version of Yondar built on the nostr protocol!
      <br/>
      <br/>
      Once go.yondar.me reaches feature parity with yondar.me, we will shut down the old Yondar and replace it with the new nostr-powered Yondar! Nostr is the future and we are excited to be a part of it! 🚀
      </p>

      <p className="send">ok cool! thnx</p>
      <p className="receive">
        np{" "}
        <span role="img" aria-label="wave">
          👋
        </span>{" "}
        have fun!
      </p>
    </div>
  )
}
