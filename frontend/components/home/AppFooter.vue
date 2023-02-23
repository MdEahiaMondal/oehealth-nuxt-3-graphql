<template>
    <section class="background tw-absolute tw-bottom tw-right-0 tw-left-0">
        <div class="custom-container">
            <h3 class="tw-text-4xl tw-font-bold tw-pt-32">Description:</h3>
            <p class="tw-text-xl tw-font-normal pt-10 pb-16">
                💎💎💎 The "Oral e-Health Monitoring Platform" aims to improve
                the oral health of the population by centralizing and
                articulating the medical-dental clinical record with its various
                stakeholders: patients, dentists, dental technicians and
                teaching/research centres. This platform will allow for an
                electronic medical-dental clinical record, as well as access to
                various diagnostic and clinical risk determination systems, and
                monitoring of treatments carried out over time. Access to the
                platform and its data is differentiated according to the user's
                profile (patient, dentist and teaching/research centre) and
                within the legal framework in force. In addition, allowing
                differentiated access to patients enables them to be aware of
                their oral health status and to be systematically alerted with
                information bulletins on good clinical practices, control and
                maintenance needs of their oral health status and treatments
                performed, thus contributing to their oral health-related
                quality of life.
            </p>
            <div class="tw-flex tw-justify-between tw-items-end tw-pb-4">
                <p class="footer-margin">Copyright OeHMP</p>
                <img src="@/assets/images/home-page/logo.svg" alt="logo" />
                <img src="@/assets/images/home-page/footer-desc.png" alt="footer-desc" />
            </div>
        </div>
    </section>
</template>

<style>
.custom-container {
    max-width: 1330px;
    margin: auto;
}

.background {
    background-image: url(@/assets/images/home-page/bg-footer.svg);
    background-color: #c6dee1 !important;
    background-size: calc(100% + 10px);
    background-position: top center;
}

.footer-margin {
    margin-bottom: 0 !important;
    margin-right: 100px;
}

.tw-bottom {
    bottom: -30rem;
}
</style>
