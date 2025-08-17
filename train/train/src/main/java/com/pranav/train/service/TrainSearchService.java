package com.pranav.train.service;

import com.pranav.train.entity.TrainSchedule;
import com.pranav.train.repo.TrainScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService {

    private TrainScheduleRepository trainScheduleRepository;

    TrainSearchService(TrainScheduleRepository trainScheduleRepository)
    {
        this.trainScheduleRepository = trainScheduleRepository;
    }

    public List<TrainSchedule> findTrainByStationCode(String sourceCode, String destinationCode)
    {
        return trainScheduleRepository.findBySource_StationCodeAndDestination_StationCode(sourceCode,destinationCode);
    }

    public List<TrainSchedule> findTrainByStationName(String sourceName, String destinationName)
    {
        return trainScheduleRepository.findBySource_StationNameAndDestination_StationName(sourceName,destinationName);
    }

}
