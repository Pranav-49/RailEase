package com.pranav.train.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainName;
    private String trainNumber;

    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<TrainSchedule> schedulelist;

    Train()
    {

    }

    public Train(String trainName, String trainNumber, List<TrainSchedule> schedulelist) {
        this.trainName = trainName;
        this.trainNumber = trainNumber;
        this.schedulelist = schedulelist;
    }

    public long getId() {
        return id;
    }

    public String getTrainName() {
        return trainName;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public List<TrainSchedule> getSchedulelist() {
        return schedulelist;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public void setSchedulelist(List<TrainSchedule> schedulelist) {
        this.schedulelist = schedulelist;
    }
}
