package com.pranav.train.controller;

import com.pranav.train.entity.TrainSchedule;
import com.pranav.train.service.TrainSearchService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin
public class TrainSearchController {

    private TrainSearchService trainSearchService;

    TrainSearchController(TrainSearchService trainSearchService)
    {
        this.trainSearchService = trainSearchService;
    }

    @GetMapping("/by-code")
    public List<TrainSchedule> findTrainByStationCode(@RequestParam String sourceCode,
                                                      @RequestParam String destinationCode)
    {
        return this.trainSearchService.findTrainByStationCode(sourceCode.toUpperCase(),destinationCode.toUpperCase());
    }

    @GetMapping("/by-name")
    public List<TrainSchedule> findTrainByStationName(@RequestParam String sourceName,
                                                      @RequestParam String destinationName)
    {
        return this.trainSearchService.findTrainByStationName(sourceName.toUpperCase(),destinationName.toUpperCase());
    }
}
