<script setup lang="ts">
    import { ref, onMounted, computed, watch } from 'vue';
    import { GoogleMap } from 'vue3-google-map';
    import axios from 'axios';

    const mapRef = ref<any>(null)
    const zoom = ref<number>(2);

    const zip = ref('');
    const zipData = ref<any>(null);
    const userData = ref<any>(null);

    const lat = ref<number>(0);
    const lng = ref<number>(0);

    const userAgent = ref<any>(null);
    const referrer = ref<any>(null);
    const utmTags = ref<any>(null)

    let errorText = ref<string>('');

    const fetchData = async () => {
        if (zip.value.length === 5) {
            try {
                const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?apikey=${import.meta.env.VITE_ZIP_API_KEY}&country=us&codes=${zip.value}`);
                
                console.log(response.data);
                if (Object.keys(response.data.results).length) {
                    zipData.value = response.data.results[zip.value][0];
                } else {
                    throw Error("This zip code is not used")
                }

                lat.value = +zipData.value.latitude
                lng.value = +zipData.value.longitude
                zoom.value = 10;
                zip.value = "";
                errorText.value = "";
            } catch (error:any) {
                console.warn(error);
                errorText.value = error.message;
            }
        } else if (zip.value.length === 0) {
            errorText.value = "Please fill Zip code";
        } else {
            errorText.value = "Please fill correct Zip code";
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://ipapi.co/json');
            userData.value = response.data;

            console.log(userData.value);

            lat.value = +userData.value.latitude
            lng.value = +userData.value.longitude

            userAgent.value = navigator.userAgent
            referrer.value = document.referrer
            utmTags.value = getUtmTags()
            zoom.value = 10;

            zip.value = "";
            errorText.value = "";
        } catch (error:any) {
            errorText.value = error.message;
        }
    }

    const getUtmTags = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const utmTags: any = {};

        for (const [key, value] of queryParams.entries()) {
            if (key.startsWith('utm')) {
                utmTags[key] = value;
            }
        }

        return utmTags;
    };

    watch(lat, () => {
        if (mapRef.value?.ready) {
            mapRef.value.map.panTo({ lat: lat.value, lng: lng.value })
        }
    })
    watch(lng, () => {
        if (mapRef.value?.ready) {
            mapRef.value.map.panTo({ lat: lat.value, lng: lng.value })
        }
    })
</script>

<template>
    <div class="container m-auto px-3">
        <div class="content mb-4">
            <div class="controls flex items-stretch justify-between pt-4 relative pb-4 flex-wrap sm:flex-nowrap">
                <div class="relative grow sm:mr-4 mb-7 sm:mb-0 basis-full sm:basis-auto">
                    <input type="text" v-model="zip" pattern="\d*" placeholder="Zip Code" ref="input"
                        class="focus:outline-none w-full focus:border-zinc-100 text-lg p-2 bg-transparent border-b-2 text-zinc-100 placeholder-slate-400 border-slate-400 box-border"/>
                    <div class="error absolute top-full l-2 text-red-500 text-sm">
                        {{ errorText }}
                    </div>
                </div>
                <button class="text-lg block basis-[49%] sm:basis-auto h-[45px] duration-300 hover:bg-slate-300 sm:mr-2 max-w-xs bg-slate-400 text-zinc-900 font-bold px-5 rounded-lg" @click="fetchData">Search</button>
                <button class="text-lg block basis-[49%] sm:basis-auto h-[45px] duration-300 hover:bg-slate-300 max-w-xs bg-slate-400 text-zinc-900 font-bold px-5 rounded-lg" @click="fetchUserData">My Data</button>
            </div>
            <div class="response flex items-start justify-between text-zinc-100">
                <div class="zip-data basis-1/2 pr-2" v-if="zipData">
                    <h2 class="text-xl mb-2">Search result</h2>
                    <div class="city mb-1" v-if="zipData.city"><span class="text-slate-400">City:</span> {{ zipData.city }}</div>
                    <div class="state mb-1" v-if="zipData.state"><span class="text-slate-400">State:</span> {{ zipData.state }}</div>
                    <div class="zip mb-1" v-if="zipData.postal_code"><span class="text-slate-400">Zip:</span> {{ zipData.postal_code }}</div>
                </div>
                <div class="user-data basis-1/2 pl-2" v-if="userData">
                    <h2  class="text-xl mb-2">Your information</h2>
                    <div class="ip mb-1" v-if="userData.ip"><span class="text-slate-400">Ip:</span> {{ userData.ip }}</div>
                    <div class="country mb-1" v-if="userData.country_name"><span class="text-slate-400">Country:</span> {{ userData.country_name }}</div>
                    <div class="city mb-1" v-if="userData.city"><span class="text-slate-400">City:</span> {{ userData.city }}</div>
                    <div class="state mb-1" v-if="userData.region"><span class="text-slate-400">State:</span> {{ userData.region }}</div>
                    <div class="state mb-1" v-if="userData.postal"><span class="text-slate-400">Postal:</span> {{ userData.postal }}</div>
                    <div class="user-agent mb-1" v-if="userAgent"><span class="text-slate-400">User Ageny:</span> {{ userAgent }}</div>
                    <div class="referrer mb-1" v-if="referrer"><span class="text-slate-400">Referrer URL:</span> {{ referrer }}</div>
                    <div class="utm mb-1" v-if="utmTags && Object.keys(utmTags).length">
                        <p></p> UTM:
                        <ul>
                            <li v-for="(tag, key) in utmTags">{{ key }}: {{ tag }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="map">
            <GoogleMap
                ref="mapRef"
                api-key="AIzaSyDhlH8Kf-bXuuoQRhGdyBpA9aWgn38ddnk"
                class="w-full h-[400px]"
                :zoom="zoom"
            />
        </div>
    </div>
</template>
  
