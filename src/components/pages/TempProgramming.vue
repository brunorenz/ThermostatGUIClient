<template>
  <div class="animated fadeIn">
    <Programming :programmingType="1"></Programming>
  </div>
</template>
<script>
import Programming from "@/components/pages/Programming";
export default {
  name: "TempProgramming",
  components: {
    Programming: Programming,
  },
};
</script>
