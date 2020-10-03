
function first_possible_move(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var possible_moves = game_state.get_possible_moves();
  return possible_moves[0];
}
first_possible_move.description = "a player that makes the first possible move in row-col order";


function random_play(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var possible_moves = game_state.get_possible_moves();
  return possible_moves[Math.floor(Math.random() * possible_moves.length)];
}
random_play.description = "a player that plays randomly";


function min_opp_mobility(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var val = Infinity;
  var best_child = null;
  var children = game_state.expand();
  for (var i in children) {
    var child = children[i];
    var opponent_moves = child.get_possible_moves();
    var opponent_move_count = opponent_moves.length; // how many moves the other player will have
    if (opponent_move_count == 0) {
      return child.player_pos[1 - child.current_player]; // return since it is a winning move
    }
    if (opponent_move_count < val) { // if this is better than old move, then update
      val = opponent_move_count;
      best_child = child;
    }
  }
  return best_child.player_pos[1 - best_child.current_player];
}
min_opp_mobility.description = "a player that makes moves only based off of restricting the mobility of the opponent on their next turn.";


function max_play_mobility(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var val = 0;
  var best_child = null;
  var children = game_state.expand();
  for (var i in children) {
    var child = children[i];
    var opponent_moves = child.get_possible_moves();
    var opponent_move_count = opponent_moves.length; // how many moves the other player will have
    if (opponent_move_count == 0) { // opponent has no moves
      return child.player_pos[1 - child.current_player]; // return since it is a winning move
    } else { // opponent has moves to make
      opponents_moves_children = child.expand();
      for (var j in opponents_moves_children) {
        var opp_child = opponents_moves_children[j];
        var player_move_count = opp_child.get_possible_moves().length; // how many moves you have
        if (player_move_count >= val) {
          val = player_move_count;
          best_child = child;
        }
      }
    }
  }
  return best_child.player_pos[1 - best_child.current_player];
}
max_play_mobility.description = "a player that makes move based off maximizing the player's mobility after this move.";


function chaser(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var val = Infinity;
  var best_child = null;
  var children = game_state.expand();
  for (var i in children) {
    var child = children[i];

    // check if you have a winning move
    var opponent_moves = child.get_possible_moves();
    var opponent_move_count = opponent_moves.length; // how many moves the other player will have
    if (opponent_move_count == 0) {
      return child.player_pos[1 - child.current_player];
    }

    // check the distance between you and the opponent
    var opp_pos = child.player_pos[child.current_player];
    var opp_r = Math.floor(opp_pos / 8);
    var opp_c = opp_pos % 8;
    var play_pos = child.player_pos[1 - child.current_player];
    var play_r = Math.floor(play_pos / 8);
    var play_c = play_pos % 8;

    var distance = Math.sqrt(Math.pow((opp_r - play_r), 2) + Math.pow((opp_c - play_c), 2));

    if (distance < val) { // if this is closer than old move, then update
      val = distance;
      best_child = child;
    }
  }
  return best_child.player_pos[1 - best_child.current_player];
}
chaser.description = "a player that makes the move that gets it the closest to the other player's position";


function min_opp_and_max_play_mobility(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var val = Infinity;
  var best_child = null;
  var children = game_state.expand();
  for (var i in children) {
    var child = children[i];
    var opponent_moves = child.get_possible_moves();
    var opponent_move_count = opponent_moves.length; // how many moves the other player will have
    if (opponent_move_count == 0) {
      return child.player_pos[1 - child.current_player]; // return since it is a winning move
    }
    child.move_to(child.player_pos[child.current_player]); // have the opponent stay where they are
    var player_move_count = -1 * child.get_possible_moves().length; // how many moves you have * -1
    var count = opponent_move_count + player_move_count;
    if (count < val) { // if this is better than old move, then update
      val = count;
      best_child = child;
    }
  }
  return best_child.player_pos[best_child.current_player];
}
min_opp_and_max_play_mobility.description = "a player that makes move based off of restructing the mobility of the opponent on their next turn and maximizing the player's mobility after this move.";





// add more here!
// don't forget to add the function to the list below

function longest_distance(board, arrow, player_pos, current_player) {
  var game_state = new State(board, arrow, player_pos, current_player);
  var children = game_state.expand();
  var player_row = Math.floor(player_pos[current_player] / 8);
  var player_col = player_pos[current_player] % 8;

  function get_distance_to_space(child) {
    var pos = child.player_pos[1 - child.current_player]
    var row = Math.floor(pos / 8);
    var col = pos % 8;
    var row_diff = Math.abs(player_row - row);
    var col_diff = Math.abs(player_col - col);
    return row_diff > col_diff ? row_diff : col_diff;
  }

  var farthest_child = children.reduce(function (farthest_child, current_child) {
    return get_distance_to_space(current_child) > get_distance_to_space(farthest_child) ?
      current_child : farthest_child;
  });

  return farthest_child.player_pos[1 - farthest_child.current_player];
}
longest_distance.description = "Always chooses to travel the longest distance possible where moving diagonally counts as 1. When faced with a tie, chooses the lowest position";






var all_AI_list = [
  first_possible_move,
  random_play,
  min_opp_mobility,
  max_play_mobility,
  chaser,
  min_opp_and_max_play_mobility,
  longest_distance,
];
