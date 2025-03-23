<script setup>
import { computed, ref } from 'vue';
import AvatarHead from './AvatarHead.vue';
import SkinView from './cabinet/SkinView.vue';
import RequestService from '@/services/request-service';
import SkinUploadModal from './modals/SkinUploadModal.vue';
import CapeUploadModal from './modals/CapeUploadModal.vue';
import Enable2FaModal from './modals/Enable2FaModal.vue';
import Disable2FaModal from './modals/Disable2FaModal.vue';
import ChangePasswordModal from './modals/ChangePasswordModal.vue';
import { useAuthStore } from '@/stores/auth';
import Dropdown from './ui/Dropdown.vue';
import AdminUserPanel from './AdminUserPanel.vue';
const authStore = useAuthStore();
const props = defineProps(['user', 'owner'])
const skin = computed(() => { return props.user ? props.user.assets.skin : null });
const cape = computed(() => { return props.user ? props.user.assets.cape : null });
const dateTimeFormat = new Intl.DateTimeFormat();
var playerinfo = ref([
    {
        name: "ID",
        value: computed(() => props.user.id)
    },
    {
        name: "UUID",
        value: computed(() => props.user.uuid)
    },
    {
        name: "Gender",
        value: computed(() => props.user.gender)
    },
    {
        name: "Reputation",
        value: computed(() => props.user.reputation)
    },
    {
        name: "Registration Date",
        value: computed(() => props.user.registrationDate ? dateTimeFormat.format(Date.parse(props.user.registrationDate)) : null)
    }
]);
var balance = ref(null);
if(props.owner) {   
    RequestService.request('GET', 'cabinet/money/balance/page/0', null).then((e) => {
        balance.value = e.data;
    })
}
var securityInfo = ref(null);
if(props.owner) {
    RequestService.request('GET', 'cabinet/security/info', null).then((e => {
        securityInfo.value = e;
    }))
}
var isAdmin = authStore.hasRole('ADMIN');
</script>
<template>
    <div class="card">
        <div class="card-header">
            <AvatarHead :skin="skin" class="avatar"></AvatarHead>
            <span class="username">{{ user.username }}</span>
            <AdminUserPanel class="usercard-adminpanel" :user="user" v-if="isAdmin"></AdminUserPanel>
        </div>
        <div>
            {{ user.status }}
        </div>
        <div class="card-separate">
            <div class="skinview card">
                <SkinView :skin="skin" :cape="cape"></SkinView>
                <div class="asset-management" v-if="owner">
                    <SkinUploadModal @uploaded="authStore.updateAsset('skin', $event)"></SkinUploadModal>
                    <CapeUploadModal @uploaded="authStore.updateAsset('cape', $event)"></CapeUploadModal>
                </div>
            </div>
            <div>
                <div>
                    <h2>Player Info</h2>
                    <div v-for="p in playerinfo.filter(x => x.value)">
                        <span class="playerinfo-name">{{ p.name }}:</span> <span class="playerinfo-value">{{ p.value
                            }}</span>
                    </div>
                </div>
                <div v-if="user">
                    <h2>Groups</h2>
                    <div v-for="p in user.groups">
                        <span class="playerinfo-group">{{ p.groupName }}</span>
                    </div>
                </div>
                <div v-if="balance">
                    <h2>Balance</h2>
                    <span v-if="balance.length == 0">No balance</span>
                    <div v-for="p in balance">
                        <span class="playerinfo-value">{{ p.balance }}</span> <span class="playerinfo-name">{{ p.currency
                            }}</span>
                    </div>
                </div>
                <div v-if="owner && securityInfo">
                    <h2>Security</h2>
                    <div class="asset-management">
                        <Enable2FaModal v-if="!securityInfo.enabled2FA"></Enable2FaModal>
                        <Disable2FaModal v-if="securityInfo.enabled2FA"></Disable2FaModal>
                        <ChangePasswordModal></ChangePasswordModal>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.avatar {
    width: 32px;
    height: 32px;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.card-separate {
    display: flex;
    gap: 40px;
}

.username {
    font-weight: 600;
}

.skinview {}

.playerinfo-name {
    font-weight: 600;
}

.asset-management {
    display: flex;
    gap: 10px;
}
.usercard-adminpanel {
    margin-left: auto;
}
</style>