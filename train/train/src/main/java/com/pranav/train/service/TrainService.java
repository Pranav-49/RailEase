package com.pranav.train.service;

import com.pranav.train.entity.Train;
import com.pranav.train.repo.TrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class TrainService {

    private TrainRepository trainRepository;

    TrainService(TrainRepository trainRepository)
    {
        this.trainRepository = trainRepository;
    }

    public List<Train> getAllTraings()
    {
        return trainRepository.findAll();
    }

    public Train addTrains(Train train)
    {
        return this.trainRepository.save(train);
    }
}
