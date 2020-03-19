<template>
  <div class="about">
    <h1>Fishbowl</h1>
    <p>
      Want to play your favorite game, without getting CVOD-19? Come back and
      play online!
    </p>

    <h3>Don't miss out on classic worlds like:</h3>
    <div class="list-wrapper">
      <ul>
        <li>Bruce Buchman</li>
        <li>Forrest of Dicks</li>
        <li>Pizza</li>
        <li>...and many more!</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.about {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.list-wrapper {
  display: flex;

  ul {
    /*list-style-type: circle;*/
    padding: 0;
  }

  li {
    /*display: inline-block;*/
    margin: 0 10px;
    text-align: left;
  }
}

a {
  color: #42b983;
}
</style>
