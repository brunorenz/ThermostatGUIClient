<template>
  <div class="animated fadeIn">
    <Programming :programmingType="2"></Programming>
  </div>
</template>
<script>
import Programming from "@/components/pages/Programming";
export default {
  name: "LightProgramming",
  components: {
    Programming: Programming,
  },
};
</script>
