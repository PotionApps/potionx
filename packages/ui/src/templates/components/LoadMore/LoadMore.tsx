import { defineComponent } from "vue";
import Btn from "../Btn/Btn";

export default defineComponent({
  props: {
    count: Number,
    loadMore: Function,
    totalCount: Number  
  },
  setup (props) {
    return () => {
      return <div>
        <Btn click={props.loadMore} label="Load More" />
        {
          !!props.count && !!props.totalCount &&
          <div>{props.count} of {props.totalCount}</div>
        }
      </div>
    }
  }
})