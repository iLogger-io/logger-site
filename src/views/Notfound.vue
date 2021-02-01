<template>
  <div class="notfound">
    <el-alert :title="$t('page_not_found')" type="success"> </el-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Notfound extends Vue {}
</script>
