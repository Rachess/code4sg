<template>
  <div class="cards">
    <card v-for="card in cards" :key="card.postID"
          :postID="card.postID"
          :title="card.title"
          :body="card.body"
          :categoryID="card.categoryID"
          :authorID="card.authorID"
          :authorNickname="card.authorNickname"
          :upVote="card.upVote"
          :downVote="card.downVote"
          :is-anonymous="card.isAnonymous"
          :updated-at="card.updatedAt"
          :commentCount="card.commentCount"
    />
  </div>
</template>

<script>
export default {
  name: "Cards",
  props: {
    cards: Array
  },
  components: {
    Card: () => import("./Card.vue")
  }
};
</script>

<style scoped>
.cards {
  display: grid;
  grid-gap: 1rem;
  margin: 1em 2rem;
  padding: 0;
}

@media (min-width: 650px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
    margin: 3rem 5em;
  }
}

@media (min-width: 900px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
