<script>
import { HorizontalBar, mixins } from "vue-chartjs";

const { reactiveProp } = mixins;

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ["height", "options", "chartData"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
