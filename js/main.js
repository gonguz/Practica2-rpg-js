var battle = new RPG.Battle();
var actionForm, spellForm, targetForm, resetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball,
            RPG.entities.scrolls.thunderstorm,
            RPG.entities.scrolls.mana
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);

    // TODO: render the characters

    var charList = Object.keys(this._charactersById);
    var typeOfChars = document.querySelectorAll('.character-list');
    var heroes = typeOfChars[0];
    var monsters = typeOfChars[1];
    var actualChar;
    var heroesHTML = ' ';
    var monstersHTML = ' ';

    charList.forEach(function(current){
      actualChar = this._charactersById[current];
      if(actualChar.hp <= 0){
        actualChar.party === 'monsters' ?
        monstersHTML += '<li data-chara-id = "'+ current + ' "class=dead>' + actualChar.name +
        '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
        ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
        '</li>' : heroesHTML += '<li data-chara-id = "'+ current + ' "class=dead>' + actualChar.name +
        '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
        ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
        '</li>'
      }else{
          if(actualChar.party === 'heroes'){
            heroesHTML += '<li data-chara-id= "' + current + '">' +
            actualChar.name +
            '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
            ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
            '</li>';
          }else{
            monstersHTML += '<li data-chara-id="' + current + '">' +
            actualChar.name +
            '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
            ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
            '</li>';
          }
        }
    }, this);

    heroes.innerHTML = heroesHTML;
    monsters.innerHTML = monstersHTML;
    // TODO: highlight current character
    var highlitedChar = document.querySelector('[data-chara-id="' + data.activeCharacterId + '"]');
    highlitedChar.classList.add("active");
    // TODO: show battle actions form

    var listOfOptions = battle.options.list();
    var optionArr = document.querySelectorAll('.choices');
    var optionShowned = optionArr[0];
    var optionsHTML = ' ';
    actionForm.style.display = 'block';

    listOfOptions.forEach(function(option){
      optionsHTML += '<li><label><input type="radio" name="option" value="' + option +'" required> ' + option +'</label></li>';
    });
    optionShowned.innerHTML = optionsHTML;

});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
    infoPanel = document.querySelector('#battle-info');
    var infoHTML = ' ';
    var failedAction = '<strong> The ' + data.action + ' thrown by ' + data.activeCharacterId + ' was not succesful </strong>';
    var effectsTxt = prettifyEffect(data.effect || {});

    if(data.action === 'attack'){
      infoHTML =  '<strong>' + data.activeCharacterId + '</strong> attacked ' + '<strong>'  + data.targetId + '</strong> and caused ' + effectsTxt;
    }else if(data.action === 'cast'){
      if(data.scrollName === 'mana'){
        infoHTML = '<strong>' + data.targetId + '</strong> has recovered mana, but lost ' + effectsTxt;
      }else {
        infoHTML = '<strong>' + data.scrollName + '</strong> was thrown by ' + '<strong>' + data.activeCharacterId + '</strong>' +
        ' and caused ' + '<strong>' + data.targetId + '</strong> ' + effectsTxt;
      }
    }else if(data.action === 'defend'){
      infoHTML = '<strong>' + data.activeCharacterId + '</strong> used defense and its value is ' + '<strong>' + data.newDefense + '</strong>';
    }

    if(data.success){
      infoPanel.innerHTML = infoHTML;
    }else{
      infoPanel.innerHTML = failedAction;
    }


});

battle.on('end', function (data) {
    console.log('END', data);
    var charList = Object.keys(this._charactersById);
    var typeOfChars = document.querySelectorAll('.character-list');
    var heroes = typeOfChars[0];
    var monsters = typeOfChars[1];
    var actualChar;
    var heroesHTML = ' ';
    var monstersHTML = ' ';

    charList.forEach(function(current){
      actualChar = this._charactersById[current];
      if(actualChar.hp <= 0){
        actualChar.party === 'monsters' ?
        monstersHTML += '<li data-chara-id = "'+ current + ' "class=dead>' + actualChar.name +
        '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
        ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
        '</li>' : heroesHTML += '<li data-chara-id = "'+ current + ' "class=dead>' + actualChar.name +
        '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
        ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
        '</li>'
      }else{
          if(actualChar.party === 'heroes'){
            heroesHTML += '<li data-chara-id= "' + current + '">' +
            actualChar.name +
            '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
            ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
            '</li>';
          }else{
            monstersHTML += '<li data-chara-id="' + current + '">' +
            actualChar.name +
            '  (HP: <strong>' + actualChar.hp + '</strong>/' + actualChar.maxHp +
            ',MP: <strong>' + actualChar.mp + '</strong>/' + actualChar.maxMp + ')' +
            '</li>';
          }
        }
    }, this);

    heroes.innerHTML = heroesHTML;
    monsters.innerHTML = monstersHTML;
    // TODO: re-render the parties so the death of the last character gets reflected
    actionForm.style.display = 'none';
    infoPanel.innerHTML =  '<strong>' + data.winner + '</strong>:*THE BATTLE WAS EXCITING, BUT ONLY ONE CAN REMAIN*';
    resetForm.style.display = 'block';

    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');
    resetForm = document.querySelector('form[name=restart-battle]');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
        var chosenAction = actionForm.elements['option'].value;
        battle.options.select(chosenAction);
        // TODO: hide this menu
        actionForm.style.display = 'none';
        // TODO: go to either select target menu, or to the select spell menu
        if(chosenAction === 'attack'){
          targetForm.style.display = 'block';
          var targets = targetForm.getElementsByClassName('choices');
          var targetShowned = targets[0];
          var actualParty = battle._activeCharacter.party;
          var targetParty;
          if(actualParty === 'heroes'){
            targetParty = 'monsters';
          }else{
            targetParty = 'heroes';
          }

          var targets = battle.characters.allFrom(targetParty);
          var targetArr = Object.keys(targets);
          var targetHTML = ' ';
          var iter = 0;
          for(var i in targets){
            if(targets[i].hp > 0){
              targetHTML += '<li><label><input type="radio" name="option" value="' + targetArr[iter] +'" required> ' + targetArr[iter] +'</label></li>';
            }
            iter++;
          }
          targetShowned.innerHTML = targetHTML;
        }
        if(chosenAction === 'cast'){
          spellForm.style.display = 'block';
          var spellsOptions = battle.options.list();
          var button = spellForm.querySelector('button[type=submit]');
          if(spellsOptions.length === 0){
            button.disabled = true;
          }else{
            button.disabled = false;
          }
          var actParty = battle._activeCharacter.party;
          var spellsList = battle._grimoires[actParty];
          var spells = spellForm.getElementsByClassName('choices');
          var spellsShowned = spells[0];
          var spellHTML = ' ';
          for(var i in spellsList){
            spellHTML += '<li><label><input type="radio" name="option" value="' + i +'" required> ' + i +'</label></li>';
          }
          spellsShowned.innerHTML = spellHTML;

        }
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var chosenTarget  = targetForm.elements['option'].value;
        battle.options.select(chosenTarget);
        // TODO: hide this menu
        targetForm.style.display = 'none';
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        var chosenSpell = spellForm.elements['option'].value;
        battle.options.select(chosenSpell);
        // TODO: hide this menu
        spellForm.style.display = 'none';
        // TODO: go to select target menu
        targetForm.style.display = 'block';
        var targets = targetForm.getElementsByClassName('choices');
        var targetShowned = targets[0];
        var actualParty = battle._activeCharacter.party;
        var enemies;
        if(actualParty === 'heroes'){
          enemies = 'monsters';
        }else{
          enemies = 'heroes';
        }

        var targets;

        if (chosenSpell === 'health' || chosenSpell === 'mana'){
          targets = battle.characters.allFrom(actualParty);
        }
        else{
          targets = battle.characters.allFrom(enemies);
        }

        var targetArr = Object.keys(targets);
        var targetHTML = ' ';
        var iter = 0;

        for(var i in targets){
          targetHTML += '<li><label><input type="radio" name="option" value="' + targetArr[iter] +'" required> ' + targetArr[iter] +'</label></li>';
          iter++;
        }
        targetShowned.innerHTML = targetHTML;
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        spellForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    battle.start();
};
