package com.pranav.train.controller;

import com.pranav.train.entity.Station;
import com.pranav.train.entity.Train;
import com.pranav.train.entity.TrainSchedule;
import com.pranav.train.repo.StationRepository;
import com.pranav.train.repo.TrainRepository;
import com.pranav.train.repo.TrainScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class Test {

    @Autowired
    StationRepository stationRepository;

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    TrainScheduleRepository trainScheduleRepository;

    @GetMapping
    public void test()
    {
        Station delhi = new Station( "New Delhi", "NDLS");
        Station mumbai = new Station( "Mumbai Central", "CST");
        Station kolkata = new Station( "Kolk ata", "KOO");
        Station chennai = new Station( "Chanai Express", "MAS");

        stationRepository.saveAll(List.of(delhi,mumbai,kolkata,chennai));

        Train rajdhani = new Train("Rajdhani Express", "120665",null);
        Train durantu = new Train("Durantu Express", "128059",null);
        Train shatabdi = new Train("Sharabdi Express", "120541",null);

        trainRepository.saveAll(List.of(rajdhani,durantu,shatabdi));

        TrainSchedule sc1 = new TrainSchedule(rajdhani,mumbai,delhi,"06.00","14.00");
        TrainSchedule sc2 = new TrainSchedule(durantu,mumbai,delhi,"09.00","18.00");
        TrainSchedule sc3 = new TrainSchedule(shatabdi,mumbai,delhi,"08.00","23.00");

        trainScheduleRepository.saveAll(List.of(sc1,sc2,sc3));

        System.out.println("database is added sucessfully");
    }
}
