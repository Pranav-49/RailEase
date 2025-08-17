package com.pranav.train.controller;

import com.pranav.train.entity.Train;
import com.pranav.train.service.TrainService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
public class TrainController {

    private TrainService trainService;

    TrainController(TrainService trainService)
    {
        this.trainService = trainService;
    }

    @GetMapping
    public List<Train> getAllTrain()
    {
        return this.trainService.getAllTraings();
    }

    @PostMapping("/addtrain")
    public Train addTrain(@RequestBody Train train)
    {
        return this.trainService.addTrains(train);
    }
}
