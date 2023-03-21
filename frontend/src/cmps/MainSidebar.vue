<template>
     <section class="sidebar">
          <img src="../assets/funday.png" alt="">
          <!-- <div class="monday-style-divider surface-divider bottom monday-style-divider--horizontal"></div> -->
          <div class="divider"></div>
          <div class="flex column">
               <div class="flex column">
                    <button><WorkManagement class="svg-icon"/></button> 
                    <button><Notifications class="svg-icon"/></button> 
                    <button><Inbox class="svg-icon"/></button> 
                    <button><MyWork class="svg-icon"/></button> 
                    <button><Favorite class="svg-icon"/></button> 
               </div>
               <button><Apps class="svg-icon"/></button> 
               <button><Invite class="svg-icon"/></button> 

          </div>

          <button><Search class="svg-icon"/></button> 
          <button><Help class="svg-icon"/></button> 
          <button><InstalledProducts class="svg-icon InstalledProducts"/></button> 
          <img src="https://files.monday.com/euc1/photos/41054538/thumb/41054538-user_photo_2023_03_18_19_59_31.png?1679169572" class="person-bullet-image person-bullet-component avatar-only-person-bullet-wrapper" title="Dor Toledano" alt="Dor Toledano" aria-hidden="true">
     </section>
</template>

<script>
import WorkManagement from '../assets/svg/WorkManagement.svg'
import Notifications from '../assets/svg/Notifications.svg'
import Inbox from '../assets/svg/Inbox.svg'
import MyWork from '../assets/svg/MyWork.svg'
import Favorite from '../assets/svg/Favorite.svg'
import Apps from '../assets/svg/Apps.svg'
import Invite from '../assets/svg/Invite.svg'
import Search from '../assets/svg/Search.svg'
import Help from '../assets/svg/Help.svg'
import InstalledProducts from '../assets/svg/InstalledProducts.svg'
import Divider from '../assets/svg/Divider.svg'

export default {
props: {},
created() {

},
data() {
return {

}
},
methods: {

},
computed: {

},
components: {
     WorkManagement,
     Notifications,
     Inbox,
     MyWork,
     Favorite,
     Apps,
     Invite,
     Search,
     Help,
     InstalledProducts,
     Divider
},
}
</script>
