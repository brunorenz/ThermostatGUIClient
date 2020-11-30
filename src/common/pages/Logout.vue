<template>
  <div class="hello"></div>
</template>
<script>
import { doLogoff } from "@/common/services/security";
import router from "@/router";
export default {
  mounted: function () {
    doLogoff();
    router.push("/login");
  },
};
</script>
