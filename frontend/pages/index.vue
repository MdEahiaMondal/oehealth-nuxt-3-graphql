<script setup lang="ts">
const clinicData = [
  {
    src: "/images/file-icon.png",
    title: "All your oral health history",
    description:
      "Manage your dental history with a functional and concise organization.",
  },
  {
    src: "/images/chat-icon.png",
    title: "Chat with your doctors",
    description:
      "Real-time access to your health care provider message board with free and open communication.",
  },
  {
    src: "/images/note-icon.png",
    title: "All your oral health history",
    description:
      "Your oral health will no longer stay behind with our alarmistic system.",
  },
];
</script>

<template>
  <main>
    <section class="banner-background tw-pt-8">
      <div class="custom-container tw-z-30">
        <div class="bottom-padding tw-relative">
          <div class="gif-shaper"></div>
          <h1 class="tw-text-7xl tw-font-black line-height">
            Oral e-Health <br />
            Monitoring Platform
          </h1>
          <div class="tw-bg-white d-inline-block rounded-50 tw-my-8">
            <h3 class="tw-text-3xl tw-font-medium tw-px-5 tw-py-2">
              Keep track of what makes you smile
            </h3>
          </div>
          <p class="tw-text-2xl tw-font-medium text-color mb-55">
            Working to give you a complete detailed and easy to
            <br />
            access and manage in-hand dental clinic record
          </p>
          <nuxt-link to="/start" class="start-button">Start Now</nuxt-link>
        </div>
      </div>
    </section>

    <section class="main-page-background">
      <div class="custom-container">
        <div class="tw-text-center padding-top">
          <h3 class="tw-text-4xl tw-font-medium tw-mb-16">
            Oral e-Health Platform gives you the right to store,
            <br />
            access and share your clinical dental data
          </h3>
        </div>
        <div class="tw-flex tw-justify-between tw-pb-10">
          <div class="tw-mr-5 w-100" v-for="(data, i) in clinicData" :key="i">
            <div class="icon-box tw-flex tw-justify-center tw-items-center">
              <img :src="data.src" alt="file-icon" />
            </div>
            <div class="tw-pl-20 tw-pr-12 tw-text-left">
              <p class="tw-text-xl tw-font-extrabold tw-pt-6">
                {{ data.title }}
              </p>
              <p class="tw-text-x tw-font-medium tw-text-[#646464] tw-pr-20">
                {{ data.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Project Sheet Section -->
        <div
          id="project"
          class="project-sheet tw-flex tw-justify-center tw-items-center tw-mt-12 tw-mb-16"
        >
          <img
            src="@/assets/images/home-page/description.png"
            alt="description"
          />
        </div>

        <!-- Description Section -->
        <div class="tw-flex tw-justify-between para-margin tw-pb-40">
          <div class="main-background">
            <div class="desc-title tw-mt-0">
              <p>Project:</p>
              <div class="capsule">
                <p>72636</p>
              </div>
            </div>
            <div class="desc-title">
              <p>Title:</p>
              <div class="capsule">
                <p>Oral e-Health Monitoring Platform</p>
              </div>
            </div>
            <div class="desc-title">
              <p>Acronym:</p>
              <div class="capsule">
                <p>OeHMP</p>
              </div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-start my-30">
              <p class="tw-font-black tw-text-2xl">Consortium composition:</p>
              <div class="capsule ml-0 mt-5">
                <p>PromptEquation and Universidade Catolica Portuguesa</p>
              </div>
            </div>
            <div class="desc-title">
              <p>Effective start date:</p>
              <div class="capsule">
                <p>1/04/21</p>
              </div>
            </div>
            <div class="desc-title">
              <p>Duration:</p>
              <div class="capsule">
                <p>30 meses</p>
              </div>
            </div>
            <div class="desc-title">
              <p>Funding:</p>
              <div class="capsule">
                <p>Portugal2020 - €447,826.53</p>
              </div>
            </div>
          </div>
          <div>
            <div class="tw-flex tw-justify-between">
              <p class="tw-opacity-0">.</p>
              <div class="desc-title tw-mb-8">
                <p>Location:</p>
                <div class="capsule">
                  <p>Guarda, Portugal</p>
                </div>
              </div>
            </div>
            <div class="map-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16544.635485952604!2d-7.133013115695555!3d40.53671010961285!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3cfac48ff6c653%3A0x400ebbde4903500!2sGuarda%2C%20Portugal!5e0!3m2!1sen!2sbd!4v1669911320191!5m2!1sen!2sbd"
                width="650"
                height="465"
                style="border: 0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.gif-shaper {
  border: 1px solid transparent;
  height: 211px;
  width: 332px;
  border-radius: 120px;
  position: absolute;
  top: 169px;
  right: 184px;
  background-image: url(@/assets/images/home-page/giphy.gif);
  background-position: 52% 65%;
  background-size: calc(100% + 25px);
}

.banner-background {
  background-image: url("@/assets/images/home-page/header-image.svg") !important;
  background-position: top;
  background-color: #c6dee1;
}

.line-height {
  line-height: 60px;
}

.rounded-50 {
  border-radius: 50px;
}

.text-color {
  color: #7c7c7c;
}

.mb-55 {
  margin-bottom: 55px !important;
}

.bottom-padding {
  padding-bottom: 10rem;
}

.padding-top {
  padding-top: 22rem;
}

.start-button {
  background-color: #bf9dff;
  color: #ffffff;
  align-items: center;
  padding: 15px 103px;
  gap: 10px;
  border-radius: 8px;
}

.main-page-background {
  background-image: url("@/assets/images/home-page/bg-main.svg");
  background-size: calc(100% + 5px);
  margin-top: -23rem;
}

.icon-box {
  height: 159.42px;
  background: linear-gradient(135deg, #bcd3d6 0%, #d0e9ec 100%);
  box-shadow: -5px 5px 10px rgba(178, 200, 203, 0.2),
    5px -5px 10px rgba(178, 200, 203, 0.2),
    -5px -5px 10px rgba(218, 244, 248, 0.9),
    5px 5px 13px rgba(178, 200, 203, 0.9);
  border-radius: 150px;
}

.map-border iframe {
  border-radius: 25px;
}

.project-sheet {
  background: url("@/assets/images/home-page/rectangle.png");
  background-size: cover;
  height: 256.76px;
  width: 100%;
  border-radius: 200px;
  border: 2px red;
}

.my-30 {
  margin: 30px 0 !important;
}

.desc-title {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.desc-title p {
  font-weight: 900;
  font-size: 24px;
}

.capsule {
  padding: 0 15px;
  height: 44px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #bcd3d6 0%, #d0e9ec 100%);
  box-shadow: -5px 5px 10px rgba(178, 200, 203, 0.2),
    5px -5px 10px rgba(178, 200, 203, 0.2),
    -5px -5px 10px rgba(218, 244, 248, 0.9),
    5px 5px 13px rgba(178, 200, 203, 0.9);
  border-radius: 50px;
}

.capsule p {
  font-size: 24px;
  font-weight: 400;
}

.para-margin p {
  margin: 0px !important;
}

@media only screen and (min-width: 1280px) and (max-width: 1367px) {
  .gif-shaper {
    height: 195px;
    width: 300px;
    top: 180px;
    right: 232px;
  }

  .main-page-background {
    margin-top: -23rem;
  }

  .padding-top {
    padding-top: 20rem;
  }
}

@media only screen and (min-width: 1367px) and (max-width: 1441px) {
  .gif-shaper {
    height: 198px;
    width: 315px;
    top: 169px;
    right: 210px;
  }

  .padding-top {
    padding-top: 20rem;
  }
}

@media only screen and (min-width: 1441px) and (max-width: 1557px) {
  .gif-shaper {
    height: 211px;
    width: 338px;
    top: 171px;
    right: 180px;
  }
}

@media only screen and (min-width: 1557px) and (max-width: 1670px) {
  .gif-shaper {
    height: 228px;
    width: 360px;
    top: 141px;
    right: 141px;
  }

  .main-page-background {
    margin-top: -25rem;
  }

  .padding-top {
    padding-top: 24rem;
  }
}

@media only screen and (min-width: 1670px) and (max-width: 2000px) {
  .gif-shaper {
    height: 263px;
    width: 419px;
    top: 90px;
    right: 60px;
    border-radius: 150px;
  }

  .main-page-background {
    margin-top: -28rem;
  }

  .padding-top {
    padding-top: 27rem;
  }
}

@media only screen and (min-width: 2001px) and (max-width: 2560px) {
  .gif-shaper {
    height: 357px;
    width: 552px;
    top: 7px;
    right: -137px;
    border-radius: 190px;
  }

  .main-page-background {
    margin-top: -33rem;
  }

  .padding-top {
    padding-top: 35rem;
  }
}
</style>
