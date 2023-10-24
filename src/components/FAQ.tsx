import { WavyText } from "./WavyText"
import "../scss/FAQ.scss"
import { GeoChatExampleButton } from "./GeoChatExampleButton"
import { FaComments } from "react-icons/fa"
import { SignUpButton } from "./SignUpButton"
import { AddExampleButton } from "./AddExampleButton"

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

const Geochat = () => <span style={{color: "#d3baf3"}}><WavyText text="Geochat"/></span>

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
        You can publish places on a decentralized map for the world to see!
      </p>
      <p className="receive">
        Just tap the map 🗺️ and hit this button:
        <br/>
        <br/>
        <AddExampleButton/>
      </p>
      <p className="send">Is it like putting a business on <Goolag/> Maps?</p>
      <p className="receive">
        Yeah, but without the <Goolag />!
      </p>
      <p className="send">
        Nice!&nbsp;
        <span role="img" aria-label="smile">
          😂🤙
        </span>
      </p>

      <p className="receive">
        The Yondar map is a social place too 😆📢
      </p>
      <p className="receive">
        <GeoChatExampleButton/>
        <br/>
        <Geochat/> lets you share posts or chat with others based on your geographic area! 🌎
      </p>
      <p className="send">
        That sounds cool, but what about privacy? 🤔
      </p>
      <p className="receive">
        Since <Geochat/> is based on regions, no precise personal location is shared. Also, chat is optional!
      </p>
      <p className="send">
        Introvert friendly! 🤓
      </p>
      <p className="receive">
        You can also see Places owned by your friends 🤗 and follows 🫡 on <a href="https://heynostr.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ae6cff'}}>nostr</a>! 🫂 
      </p>
      <p className="send">
        TOASTR? 😮🍞🔥
      </p>
      <p className="receive">
        No, NOSTR! 🤦‍♂️ It's a new <a href="https://heynostr.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ae6cff'}}>social internet</a> that makes new kinds of apps possible!
      </p>
      <p className="send">
        That sounds fun! Do I need an account? ✍
      </p>
      <p className="receive">
        Boom:&nbsp;
        <SignUpButton/>
        <br/>
        <br/>
        It's all anonymous 🎭 unless you want to fill out your profile.
        <br/>
        <br/>
        With one click you can have a new account and join the fun!
        <br/>
        <br/>
        Or sign in if you're a nostr user already.
      </p>

      <p className="send">
        Wow that's amazing! What does my account do? 💪
      </p>

      <p className="receive">
        It allows you to create places 📍, edit them, and post in <Geochat/>
        <br/>
        <br/>
        Then you can take your identity to any other <a href="https://nostrapps.com" target="_blank" rel="noopener noreferrer" >nostr-compatible app</a> and use it there too! That's the superpower of the nostr protocol!
        <br/>
        <br/>
        If you already have a nostr id, you can use it through a browser extension like <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">Alby on Desktop</a>, <a href="https://apps.apple.com/us/app/nostore/id1666553677" target="_blank" rel="noopener noreferrer">Nostore for iOS</a>, or <a href="https://github.com/nostrband/nostr-universe/releases/tag/v0.1.4" target="_blank" rel="noopener noreferrer">Spring browser for Android</a>.
      </p>

      <p className="send">
        What is my location used for? 🤔
      </p>
      <p className="receive">
        Your GPS location simply shows where you are on the map in relation to other places. It can be helpful if you want to put a new place right where you are! 🎯
        <br/>
        <br/>
        Your location is not transmitted, and our code is <a href="https://github.com/innovatar/yondar-mono.git" target="_blank" rel="noopener noreferrer">open-sourced</a> to prove it. <a href="https://innovatar.io" target="_blank" rel="noopener noreferrer">We are</a> regular people who value our privacy, so we built Yondar to do the same for you. ✅
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

      <p className="send">What is <a href="https://yondar.me">https://yondar.me</a>? Is it a different app?</p>

      <p className="receive">Yondar.me started out as a centralized web2 PWA, but go.yondar.me is our new decentralized version of Yondar built on the nostr protocol!
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
