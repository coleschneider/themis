<template>
    <div class="thread-list-container">
        <ul v-if="threads.length">
            <li class="thread-entry"
                v-for="thread in threads"
                :key="thread.id"
                @click="$emit('thread-selected', thread)"
            >
                <span class="post-subject">{{thread.subject}}</span>
                <span class="post-sender">{{formatSender(thread.sender)}}</span>
                <span class="post-date">{{thread.date}}</span>
            </li>
        </ul>
        <p v-else>
            {{noThreadsText}}
        </p>
    </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import axios from 'axios'

export default Vue.extend({
    data () {
        return {
            threads: [],
            noThreadsText: "No posts in this group. Create one or choose another group."
        }
    },
    props: [
        'group'
    ],
    computed: {
        visibleThreads: function () {
            // TODO: add filtering, etc.
            return this.threads;
        }
    },
    methods: {
        formatSender: function (sender) {
            // TODO: add formatting, like with groups
            return sender;
        },
        retrievePosts: function () {
            if (this.group) {
                axios.get(`/internal/posts/by-group/${this.group.name}`)
                    .then(response => this.group)
                    .catch(error => console.log(error));
            }
        }
    },
    mounted () {
        this.retrievePosts();
    }
})
</script>

<style>

</style>