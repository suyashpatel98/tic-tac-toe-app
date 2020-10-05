package com.example.tictactoe.files;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/*
    Input State : String
    Output State : JSONArray
 */

@RestController
public class Controller {

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(method = RequestMethod.POST, value = "/state")
    public List<String> returnState(@RequestBody String input){
        List<String> response = null;
        try{

            int[][] board = MinimaxAlgo.returnState(processInputState(input));
            response = processOutputState(board);
        }catch (Exception e){
            System.out.println("exception : " + e.toString());
        }
        return response;
    }

    /*Util Methods*/
    public static int[][] processInputState(String input){
        int[][] board = new int[3][3];
        try{
            JSONObject state = new JSONObject(input);
            System.out.println(state);
            JSONArray data = state.getJSONArray("data");

            HashMap<String,Integer> map = new HashMap<>();
            map.put("X",1);
            map.put("O",2);
            /*2- User and 1-Computer*/
            for(int i = 0; i < board.length; i++){
                for(int j = 0; j < board[0].length; j++){
                    int index = 3*i+j;
                    board[i][j] = map.getOrDefault(data.getString(index),0);
                }
            }
        }catch (Exception e){
            System.out.println("Exception in processInputState : " + e.toString());
        }

        return board;
    }

    public static List processOutputState(int[][] board){
        HashMap<Integer,String> map = new HashMap<>();
        map.put(1,"X");
        map.put(2,"O");
        List<String> res = new ArrayList<String>();
        for(int i = 0; i < board.length; i++){
            for(int j = 0; j < board[0].length; j++){
                res.add(map.getOrDefault(board[i][j],null));
            }
        }
        return res;
    }
}
